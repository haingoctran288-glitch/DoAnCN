import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const branches = [
  {
    id: 1,
    name: 'The Classic - Quận 1',
    shortName: 'Quận 1',
    address: '15 Lê Lợi, P. Bến Nghé, Quận 1, TP. HCM',
    phone: '0901 234 567',
    hours: '08:00 - 21:00 (T2 - CN)',
    image: 'images/cn quan1.png',
    tag: 'Flagship Store'
  },
  {
    id: 2,
    name: 'The Vintage - Quận 2',
    shortName: 'Quận 2',
    address: '22 Trần Não, P. Bình An, Quận 2, TP. HCM',
    phone: '0904 567 890',
    hours: '08:00 - 21:00 (T2 - CN)',
    image: 'images/cn quan2.png',
    tag: 'Signature Studio'
  },
  {
    id: 3,
    name: 'The Modern - Quận 3',
    shortName: 'Quận 3',
    address: '45 Nguyễn Đình Chiểu, Phường 6, Quận 3, TP. HCM',
    phone: '0902 345 678',
    hours: '08:00 - 21:00 (T2 - CN)',
    image: 'images/cn quan3.png',
    tag: 'Premium Style'
  },
  {
    id: 4,
    name: 'The Luxury - Quận 7',
    shortName: 'Quận 7',
    address: '99 Nguyễn Văn Linh, Tân Phong, Quận 7, TP. HCM',
    phone: '0903 456 789',
    hours: '08:00 - 21:00 (T2 - CN)',
    image: 'images/cn quan7.png',
    tag: 'Exclusive Lounge'
  },
  {
    id: 5,
    name: 'The Street - Quận 9',
    shortName: 'Quận 9',
    address: '99 Lê Văn Việt, Tăng Nhơn Phú A, Quận 9, TP. HCM',
    phone: '0905 678 901',
    hours: '08:00 - 21:00 (T2 - CN)',
    image: 'images/cn quan9.png',
    tag: 'Street Style'
  },
  {
    id: 6,
    name: 'The Urban - Bình Thạnh',
    shortName: 'Bình Thạnh',
    address: '33 Xô Viết Nghệ Tĩnh, Phường 17, Bình Thạnh, TP. HCM',
    phone: '0906 789 012',
    hours: '08:00 - 21:00 (T2 - CN)',
    image: 'images/cn binhthanh.png',
    tag: 'Urban Barbershop'
  }
];

const AboutBranches = () => {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-accent text-[12px] font-black uppercase tracking-[6px] mb-6 block"
          >
            Our Locations
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-heading font-black text-white"
          >
            Hệ thống <span className="text-gray-600 italic">Chi nhánh</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto mt-6 font-medium"
          >
            Trải nghiệm không gian Barber chuẩn Luxury tại 6 chi nhánh trung tâm TP.HCM. Chúng tôi luôn sẵn sàng phục vụ bạn với chất lượng đồng nhất.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {branches.map((branch, idx) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              className="group relative bg-[#0a0a0a] rounded-[32px] overflow-hidden border border-white/5 hover:border-accent/30 transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.1)] flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={branch.image}
                  alt={branch.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>

                {/* Tag */}
                <div className="absolute top-6 right-6 z-20 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-accent/30 rounded-full">
                  <span className="text-accent text-[10px] font-black uppercase tracking-widest">{branch.tag}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex-1 flex flex-col relative z-20 -mt-10">
                <h3 className="text-2xl font-heading font-bold text-white mb-6 group-hover:text-accent transition-colors">
                  {branch.name}
                </h3>

                <div className="space-y-4 flex-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-sm font-medium">{branch.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-500 shrink-0" />
                    <p className="text-gray-400 text-sm font-medium">{branch.phone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-500 shrink-0" />
                    <p className="text-gray-400 text-sm font-medium">{branch.hours}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                  <Link to="/booking" state={{ branch: branch.shortName }} className="text-accent font-black text-xs uppercase tracking-widest hover:text-white transition-colors">
                    Đặt lịch chi nhánh này
                  </Link>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutBranches;
