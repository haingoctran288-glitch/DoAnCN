package com.example.API_java.service;

import com.example.API_java.entity.Address;
import com.example.API_java.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;

    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDesc(userId);
    }

    public Address getAddressById(Long id) {
        return addressRepository.findById(id).orElse(null);
    }

    @Transactional
    public Address createAddress(Address address) {
        // Nếu là địa chỉ đầu tiên của user thì set là default
        List<Address> existing = addressRepository.findByUserIdOrderByIsDefaultDesc(address.getUserId());
        if (existing.isEmpty() || (address.getIsDefault() != null && address.getIsDefault())) {
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }

        Address saved = addressRepository.save(address);
        if (saved.getIsDefault()) {
            addressRepository.resetDefaultAddresses(saved.getUserId(), saved.getId());
        }
        return saved;
    }

    @Transactional
    public Address updateAddress(Long id, Address updatedAddress) {
        Address existing = addressRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(updatedAddress.getName());
            existing.setPhone(updatedAddress.getPhone());
            existing.setAddress(updatedAddress.getAddress());
            
            if (updatedAddress.getIsDefault() != null && updatedAddress.getIsDefault()) {
                existing.setIsDefault(true);
            }
            
            Address saved = addressRepository.save(existing);
            if (saved.getIsDefault()) {
                addressRepository.resetDefaultAddresses(saved.getUserId(), saved.getId());
            }
            return saved;
        }
        return null;
    }

    @Transactional
    public void deleteAddress(Long id) {
        Address address = addressRepository.findById(id).orElse(null);
        if (address != null) {
            boolean wasDefault = address.getIsDefault();
            Long userId = address.getUserId();
            addressRepository.deleteById(id);
            
            // Nếu xóa địa chỉ default, chọn địa chỉ đầu tiên còn lại làm default
            if (wasDefault) {
                List<Address> remaining = addressRepository.findByUserIdOrderByIsDefaultDesc(userId);
                if (!remaining.isEmpty()) {
                    Address newDefault = remaining.get(0);
                    newDefault.setIsDefault(true);
                    addressRepository.save(newDefault);
                }
            }
        }
    }

    @Transactional
    public Address setDefaultAddress(Long id) {
        Address address = addressRepository.findById(id).orElse(null);
        if (address != null) {
            address.setIsDefault(true);
            addressRepository.save(address);
            addressRepository.resetDefaultAddresses(address.getUserId(), address.getId());
            return address;
        }
        return null;
    }
}
