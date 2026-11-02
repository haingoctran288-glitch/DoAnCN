package com.example.API_java.controller;

import com.example.API_java.dto.ServiceRequest;
import com.example.API_java.entity.Service;
import com.example.API_java.entity.ServiceCategory;
import com.example.API_java.entity.ModelType;
import com.example.API_java.repository.BookingRepository;
import com.example.API_java.repository.ServiceRepository;
import com.example.API_java.repository.ServiceCategoryRepository;
import com.example.API_java.repository.ModelTypeRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ServiceCategoryRepository categoryRepository;

    @Autowired
    private ModelTypeRepository modelTypeRepository;

    @PostConstruct
    public void migrateData() {
        try {
            // Seed Categories
            String[][] categories = {
                {"Dịch vụ cho Nam", "NAM"},
                {"Dịch vụ cho Nữ", "NU"}
            };
            for (String[] cat : categories) {
                if (categoryRepository.findByCode(cat[1]) == null) {
                    ServiceCategory sc = new ServiceCategory();
                    sc.setName(cat[0]);
                    sc.setCode(cat[1]);
                    categoryRepository.save(sc);
                }
            }

            // Migrate Services
            List<Service> services = serviceRepository.findAll();
            for (Service s : services) {
                if (s.getModelType() != null) continue;

                String catCode = s.getMainCategory();
                if (catCode == null || catCode.isEmpty()) catCode = "NAM";
                ServiceCategory sc = categoryRepository.findByCode(catCode);
                if (sc == null) sc = categoryRepository.findByCode("NAM");

                String subCatName = s.getSubCategory();
                if (subCatName == null || subCatName.isEmpty()) {
                    subCatName = s.getServiceGroup();
                }
                
                String name = s.getName() != null ? s.getName().toLowerCase() : "";
                String finalModelName = "Dịch vụ khác";
                
                if (subCatName != null) {
                    if (subCatName.equals("CAT_TOC_CHAM_SOC_DA_RAU") || "Cắt tóc - Chăm sóc da & Râu".equals(subCatName)) {
                        finalModelName = "Cắt tóc - Chăm sóc da & Râu";
                    } else if (subCatName.equals("CAT_TOC_CHAM_SOC_TOC")) {
                        finalModelName = "Cắt tóc - Chăm sóc tóc";
                    } else if (subCatName.equals("UON_NHUOM_EP_TOC") || subCatName.contains("UON_") || subCatName.contains("NHUOM_") || subCatName.equals("Uốn & Nhuộm")) {
                        if (name.contains("nhuộm") || name.contains("tẩy") || name.contains("bạch kim")) finalModelName = "Nhuộm tóc";
                        else if (name.contains("uốn") || name.contains("ép") || name.contains("side")) finalModelName = "Uốn tóc";
                        else finalModelName = "Uốn & Nhuộm";
                    } else if (subCatName.equals("CAT_TOC_TAN_NOI") || subCatName.equals("CAT_TOC_SU_KIEN")) {
                        finalModelName = "Cắt tóc";
                    } else if (subCatName.equals("MAKEUP_TAN_NOI") || subCatName.equals("MAKEUP_SU_KIEN")) {
                        finalModelName = "Trang điểm";
                    } else if (subCatName.equals("CHAM_SOC_TAN_NOI")) {
                        finalModelName = "Chăm sóc da";
                    } else if (subCatName.equals("STYLING_SU_KIEN")) {
                        finalModelName = "Tạo kiểu";
                    } else if (subCatName.equals("Dịch vụ chung") || subCatName.equals("Khác")) {
                        if (name.contains("cắt") || name.contains("cạo") || name.contains("gội")) finalModelName = "Cắt tóc - Chăm sóc da & Râu";
                        else if (name.contains("nhuộm") || name.contains("tẩy")) finalModelName = "Nhuộm tóc";
                        else if (name.contains("uốn") || name.contains("ép")) finalModelName = "Uốn tóc";
                        else finalModelName = "Dịch vụ khác";
                    } else {
                        finalModelName = subCatName;
                    }
                }

                ModelType mt = modelTypeRepository.findByNameAndCategoryId(finalModelName, sc.getId());
                if (mt == null) {
                    mt = new ModelType();
                    mt.setName(finalModelName);
                    mt.setCategory(sc);
                    mt = modelTypeRepository.save(mt);
                }

                s.setModelType(mt);
                serviceRepository.save(s);
            }
            
            // Clean up legacy ugly names if they exist and are unused (we just try to delete them)
            List<ModelType> allModels = modelTypeRepository.findAll();
            for (ModelType m : allModels) {
                String mName = m.getName();
                if (mName.equals("UON_NHUOM_EP_TOC") || mName.equals("CAT_TOC_CHAM_SOC_DA_RAU") || 
                    mName.equals("Dịch vụ chung") || mName.equals("CAT_TOC_CHAM_SOC_TOC")) {
                    try {
                        modelTypeRepository.delete(m);
                    } catch(Exception ignored) {} // Ignore if still referenced
                }
            }
        } catch (Exception e) {
            System.err.println("Migration failed: " + e.getMessage());
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/model-types")
    public ResponseEntity<?> getModelTypes(@RequestParam(required = false) Integer categoryId) {
        if (categoryId != null) {
            return ResponseEntity.ok(modelTypeRepository.findByCategoryId(categoryId));
        }
        return ResponseEntity.ok(modelTypeRepository.findAll());
    }

    // Lấy tất cả dịch vụ (cho Admin)
    @GetMapping("/all")
    public List<Service> getAllForAdmin() {
        return serviceRepository.findAllByOrderBySortOrderAsc();
    }

    // Lấy danh sách dịch vụ đang hoạt động (cho Frontend)
    @GetMapping
    public List<Service> getActiveServices(@RequestParam(required = false) String type) {
        if (type == null || type.isEmpty() || "all".equals(type)) {
            return serviceRepository.findByStatusOrderBySortOrderAsc("active");
        }
        return serviceRepository.findByCategoryTypeAndStatusOrderBySortOrderAsc(type, "active");
    }

    // Lấy chi tiết dịch vụ
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return serviceRepository.findById(id).map(service -> {
            return ResponseEntity.ok(service);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Lấy dịch vụ theo nhóm chính
    @GetMapping("/main-category/{mainCategory}")
    public List<Service> getByMainCategory(@PathVariable String mainCategory) {
        return serviceRepository.findByMainCategoryOrderBySortOrderAsc(mainCategory)
                .stream().filter(s -> "active".equals(s.getStatus())).toList();
    }

    private void mapDtoToEntity(ServiceRequest dto, Service service) {
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());
        service.setDuration(dto.getDuration());
        service.setImage(dto.getImage());
        service.setStatus(dto.getStatus() != null ? dto.getStatus() : "active");

        if (dto.getCategoryId() != null && dto.getModelTypeName() != null) {
            ServiceCategory sc = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            if (sc != null) {
                ModelType mt = modelTypeRepository.findByNameAndCategoryId(dto.getModelTypeName(), sc.getId());
                if (mt == null) {
                    mt = new ModelType();
                    mt.setName(dto.getModelTypeName());
                    mt.setCategory(sc);
                    mt = modelTypeRepository.save(mt);
                }
                service.setModelType(mt);
                service.setMainCategory(sc.getCode());
            }
        }

        // Legacy fields
        if (dto.getCategoryType() != null) service.setCategoryType(dto.getCategoryType());
        if (dto.getServiceGroup() != null) service.setServiceGroup(dto.getServiceGroup());

        // New fields
        if (dto.getGenderType() != null) service.setGenderType(dto.getGenderType());
        if (dto.getSlug() != null) service.setSlug(dto.getSlug());
        if (dto.getMainCategory() != null) service.setMainCategory(dto.getMainCategory());
        if (dto.getSubCategory() != null) service.setSubCategory(dto.getSubCategory());
    }

    // Thêm dịch vụ mới
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ServiceRequest request) {
        try {
            Service service = new Service();
            mapDtoToEntity(request, service);

            // Gán sort_order
            List<Service> existing = null;
            if (service.getMainCategory() != null) {
                existing = serviceRepository.findByMainCategoryOrderBySortOrderAsc(service.getMainCategory());
            } else if (service.getServiceGroup() != null) {
                existing = serviceRepository.findByServiceGroupOrderBySortOrderAsc(service.getServiceGroup());
            }

            if (existing != null && !existing.isEmpty()) {
                service.setSortOrder(existing.get(existing.size() - 1).getSortOrder() + 1);
            } else {
                service.setSortOrder(1);
            }

            // Gán model_sort_order
            if (service.getModelType() != null) {
                Integer modelTypeId = service.getModelType().getId();
                List<Service> modelExisting = serviceRepository.findAll().stream()
                    .filter(s -> s.getModelType() != null && s.getModelType().getId().equals(modelTypeId))
                    .sorted((a, b) -> Integer.compare(a.getModelSortOrder() == null ? 0 : a.getModelSortOrder(), b.getModelSortOrder() == null ? 0 : b.getModelSortOrder()))
                    .collect(java.util.stream.Collectors.toList());
                if (!modelExisting.isEmpty()) service.setModelSortOrder(modelExisting.get(modelExisting.size() - 1).getModelSortOrder() + 1);
                else service.setModelSortOrder(1);
            } else {
                service.setModelSortOrder(0);
            }

            Service saved = serviceRepository.save(service);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

    // Sửa dịch vụ
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody ServiceRequest request) {
        return serviceRepository.findById(id).map(service -> {
            // Xử lý đổi nhóm
            if (request.getModelTypeName() != null) {
                Integer modelTypeId = service.getModelType().getId();
                List<Service> modelExisting = serviceRepository.findAll().stream()
                    .filter(s -> s.getModelType() != null && s.getModelType().getId().equals(modelTypeId))
                    .sorted((a, b) -> Integer.compare(a.getModelSortOrder() == null ? 0 : a.getModelSortOrder(), b.getModelSortOrder() == null ? 0 : b.getModelSortOrder()))
                    .collect(java.util.stream.Collectors.toList());
                if (!modelExisting.isEmpty()) service.setModelSortOrder(modelExisting.get(modelExisting.size() - 1).getModelSortOrder() + 1);
                else service.setModelSortOrder(1);
            } else {
                service.setModelSortOrder(0);
            }
            if (request.getMainCategory() != null && !request.getMainCategory().equals(service.getMainCategory())) {
                List<Service> existing = serviceRepository.findByMainCategoryOrderBySortOrderAsc(request.getMainCategory());
                if (!existing.isEmpty()) service.setSortOrder(existing.get(existing.size() - 1).getSortOrder() + 1);
                else service.setSortOrder(1);
            } else if (request.getServiceGroup() != null && !request.getServiceGroup().equals(service.getServiceGroup())) {
                List<Service> existing = serviceRepository.findByServiceGroupOrderBySortOrderAsc(request.getServiceGroup());
                if (!existing.isEmpty()) service.setSortOrder(existing.get(existing.size() - 1).getSortOrder() + 1);
                else service.setSortOrder(1);
            }

            mapDtoToEntity(request, service);
            Service saved = serviceRepository.save(service);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Xóa dịch vụ
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        return serviceRepository.findById(id).map(service -> {
            try {
                // Xóa tất cả các booking có liên quan đến dịch vụ này
                List<com.example.API_java.entity.Booking> relatedBookings = bookingRepository.findByServiceIdOrInServices(service.getId());
                if (!relatedBookings.isEmpty()) {
                    bookingRepository.deleteAll(relatedBookings);
                }

                // Sau đó xóa dịch vụ
                serviceRepository.delete(service);
                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Lỗi khi xóa dịch vụ: " + e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // Reorder dịch vụ
    @PatchMapping("/reorder")
    public ResponseEntity<?> reorder(@RequestBody Map<String, Object> data) {
        try {
            Integer serviceId = Integer.valueOf(data.get("serviceId").toString());
            String action = data.get("action").toString();

            Service service = serviceRepository.findById(serviceId).orElse(null);
            if (service == null) return ResponseEntity.notFound().build();

            String filterContext = data.containsKey("filterContext") ? data.get("filterContext").toString() : "modelType";
            
            List<Service> groupServices = serviceRepository.findAll();
            if ("global".equals(filterContext)) {
                // Use dedicated globalSortOrder — completely independent of sortOrder
                groupServices = groupServices.stream()
                    .sorted((a, b) -> Integer.compare(a.getGlobalSortOrder() == null ? 0 : a.getGlobalSortOrder(), b.getGlobalSortOrder() == null ? 0 : b.getGlobalSortOrder()))
                    .collect(java.util.stream.Collectors.toList());
            } else if ("modelType".equals(filterContext) && service.getModelType() != null) {
                Integer modelTypeId = service.getModelType().getId();
                groupServices = groupServices.stream()
                    .filter(s -> s.getModelType() != null && s.getModelType().getId().equals(modelTypeId))
                    .sorted((a, b) -> Integer.compare(a.getModelSortOrder() == null ? 0 : a.getModelSortOrder(), b.getModelSortOrder() == null ? 0 : b.getModelSortOrder()))
                    .collect(java.util.stream.Collectors.toList());
            } else if ("mainCategory".equals(filterContext) && service.getMainCategory() != null) {
                String mainCat = service.getMainCategory();
                groupServices = groupServices.stream()
                    .filter(s -> s.getMainCategory() != null && s.getMainCategory().equals(mainCat))
                    .sorted((a, b) -> Integer.compare(a.getSortOrder() == null ? 0 : a.getSortOrder(), b.getSortOrder() == null ? 0 : b.getSortOrder()))
                    .collect(java.util.stream.Collectors.toList());
            } else {
                groupServices = serviceRepository.findByServiceGroupOrderBySortOrderAsc(service.getServiceGroup());
            }

            if (groupServices.size() <= 1) return ResponseEntity.ok().build();

            int currentIndex = -1;
            for (int i = 0; i < groupServices.size(); i++) {
                if (groupServices.get(i).getId().equals(serviceId)) {
                    currentIndex = i;
                    break;
                }
            }
            if (currentIndex == -1) return ResponseEntity.badRequest().build();

            switch (action) {
                case "move_top":
                    if (currentIndex > 0) {
                        groupServices.remove(currentIndex);
                        groupServices.add(0, service);
                    }
                    break;
                case "move_up":
                    if (currentIndex > 0) {
                        Service temp = groupServices.get(currentIndex - 1);
                        groupServices.set(currentIndex - 1, service);
                        groupServices.set(currentIndex, temp);
                    }
                    break;
                case "move_down":
                    if (currentIndex < groupServices.size() - 1) {
                        Service temp = groupServices.get(currentIndex + 1);
                        groupServices.set(currentIndex + 1, service);
                        groupServices.set(currentIndex, temp);
                    }
                    break;
                case "move_bottom":
                    if (currentIndex < groupServices.size() - 1) {
                        groupServices.remove(currentIndex);
                        groupServices.add(service);
                    }
                    break;
                default:
                    return ResponseEntity.badRequest().body("Invalid action");
            }

            for (int i = 0; i < groupServices.size(); i++) {
                Service s = groupServices.get(i);
                if ("global".equals(filterContext)) {
                    s.setGlobalSortOrder(i + 1);
                } else if ("modelType".equals(filterContext)) {
                    s.setModelSortOrder(i + 1);
                } else {
                    s.setSortOrder(i + 1);
                }
                serviceRepository.save(s);
            }

            return ResponseEntity.ok(groupServices);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }
}
