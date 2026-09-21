import React from 'react';

// Mảng chứa danh sách các links, rất dễ dàng thêm/sửa/xoá
const socialLinks = [
  {
    id: 1,
    name: 'GitHub Của Tôi',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    url: 'https://github.com',
    hoverStyle: 'hover:bg-gray-900 hover:text-white hover:border-gray-900',
  },
  {
    id: 2,
    name: 'LinkedIn Professional',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
    url: 'https://linkedin.com',
    hoverStyle: 'hover:bg-blue-600 hover:text-white hover:border-blue-600',
  },
  {
    id: 3,
    name: 'Instagram Cá Nhân',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
    url: 'https://instagram.com',
    hoverStyle: 'hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent',
  },
  {
    id: 4,
    name: 'Liên Hệ Qua Zalo',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    url: 'tel:+84123456789',
    hoverStyle: 'hover:bg-blue-500 hover:text-white hover:border-blue-500',
  }
];

const LinkInBio = () => {
  return (
    // Background tổng thể của trang
    <div className="min-h-screen bg-gray-50 flex items-center justify-center sm:py-12">
      
      {/* Container chính: 
          - Mobile (mặc định): Full màn hình (min-h-screen, w-full, không border)
          - Desktop (sm trở lên): Giới hạn max-w-md (khoảng 448px), bo tròn thành card, có đổ bóng, nằm chính giữa
      */}
      <div className="w-full min-h-screen sm:min-h-0 sm:max-w-md bg-white sm:rounded-[2rem] sm:shadow-2xl overflow-hidden relative border-0 sm:border border-gray-100 flex flex-col">
        
        {/* Header Cover: Gradient background */}
        <div className="h-40 sm:h-48 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Nội dung chính: Đẩy lùi lên trên (negative margin) để avatar đè lên nền cover */}
        <div className="px-6 pb-8 flex-1 relative -top-16">
          
          {/* Avatar Profile */}
          <div className="flex justify-center mb-4">
            <div className="relative group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                alt="Profile Avatar" 
                className="w-32 h-32 rounded-full border-[6px] border-white shadow-md object-cover bg-white group-hover:scale-105 transition-transform duration-300 relative z-10"
              />
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping z-0 group-hover:animate-none"></div>
            </div>
          </div>
          
          {/* Thông tin Text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">John Doe</h1>
            <p className="text-primary font-medium mb-4 flex items-center justify-center gap-1">
              @johndoe.dev
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </p>
            <p className="text-gray-600 text-sm leading-relaxed px-2">
              👋 Xin chào! Tôi là Frontend Developer.<br/>
              Chia sẻ kiến thức về lập trình, thiết kế UI/UX và hành trình sáng tạo nội dung số.
            </p>
          </div>

          {/* Danh sách các Buttons */}
          <div className="space-y-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl 
                  transition-all duration-300 ease-out
                  transform hover:-translate-y-1 hover:shadow-lg
                  text-gray-700
                  ${link.hoverStyle}
                `}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-current">
                  {link.icon}
                </div>
                <div className="flex-grow text-center font-bold text-[15px] pr-10">
                  {link.name}
                </div>
              </a>
            ))}
          </div>

        </div>
        
        {/* Footer (Credit / Bottom spacing) */}
        <div className="text-center pb-6 pt-4 text-gray-400 text-xs font-medium uppercase tracking-widest mt-auto">
          Tạo với <span className="text-red-500">♥</span> & Tailwind CSS
        </div>

      </div>
    </div>
  );
};

export default LinkInBio;
