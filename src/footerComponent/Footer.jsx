import React from 'react'
import american from '../assets/footer/american.png';
import circle from '../assets/footer/circle.png';
import cod from '../assets/footer/cod.png';
import jcb from '../assets/footer/jcb.png';
import pay from '../assets/footer/pay.png';
import paylater from '../assets/footer/paylater.png';
import tragop from '../assets/footer/tragop.png';
import visa from '../assets/footer/visa.png';

import spx from '../assets/footer/spx.png';
import ghn from '../assets/footer/ghn.png';
import viettel from '../assets/footer/viettel.png';
import vietnam from '../assets/footer/vietnam.png';
import jt from '../assets/footer/j&t.png';
import grab from '../assets/footer/grab.png';
import ninjavan from '../assets/footer/ninjavan.png';
import be from '../assets/footer/be.png';
import ahamove from '../assets/footer/ahamove.png';

import qr from '../assets/footer/qr.png';
import appstore from '../assets/footer/AppStore.png';
import appGallery from '../assets/footer/appGallery.png';
import ggPlay from '../assets/footer/ggPlay.png';
const Footer = () => {
    const images = [visa, circle, jcb, american, cod, tragop, pay, paylater];
    const images2 = [spx, ghn, viettel, vietnam, jt, grab, ninjavan, be, ahamove];
    const customerServices = [
        "DỊCH VỤ KHÁCH HÀNG",
        "Trung Tâm Trợ Giúp Shopee",
        "Shopee Blog",
        "Shopee Mall",
        "Hướng Dẫn Mua Hàng/Đặt Hàng",
        "Hướng Dẫn Bán Hàng",
        "Ví ShopeePay",
        "Shopee Xu",
        "Đơn Hàng",
        "Trả Hàng/Hoàn Tiền",
        "Liên Hệ Shopee",
        "Chính Sách Bảo Hành"
    ];
    const shopeeVietNam = [
        "SHOPEE VIỆT NAM",
        "Về Shopee",
        "Tuyển Dụng",
        "Điều Khoản Shopee",
        "Chính Sách Bảo Mật",
        "Shopee Mall",
        "Kênh Người Bán",
        "Flash Sale",
        "Tiếp Thị Liên Kết",
        "Liên Hệ Truyền Thông"
    ];
    return (
        <footer className='flex justify-around bg-zinc-100 mt-10 pt-10 pb-5'>
            <div>
                <ul className=' flex flex-col gap-y-2'>
                    {customerServices.map((item, index) => (
                        <li
                            key={index}
                            className={index === 0 ? "font-bold text-sm" : "text-xs cursor-pointer hover:text-red-500"} 
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <ul className=' flex flex-col gap-y-2'>
                    {shopeeVietNam.map((item, index) => (
                        <li
                            key={index}
                            className={index === 0 ? "font-bold text-sm" : "text-xs cursor-pointer hover:text-red-500"} 
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <p className='font-bold text-sm'>THANH TOÁN</p>
                <div className='grid grid-cols-3 gap-2 mt-3 '>
                    {images.map((src, index) => (
                        <img key={index} className="bg-white p-1 rounded cursor-pointer" src={src} alt="" />
                    ))}
                </div>
                <p className='font-bold mt-3'>ĐƠN VỊ VẬN CHUYỂN</p>
                <div className='grid grid-cols-3 gap-2 mt-3'>
                    {images2.map((src, index) => (
                        <img key={index} className="bg-white p-1 rounded cursor-pointer" src={src} alt="" />
                    ))}
                </div>
            </div>
            <div>
                <ul className='flex flex-col gap-y-2'>
                    <li className='font-bold text-sm'>THEO DÕI SHOPEE</li>
                    <li className='text-xs cursor-pointer hover:text-red-500'>Facebook</li>
                    <li className='text-xs cursor-pointer hover:text-red-500'>Instagram</li>
                    <li className='text-xs cursor-pointer hover:text-red-500'>LinkedIn</li>
                </ul>
            </div>
            <div>
                <p className='font-bold text-sm'>TẢI ỨNG DỤNG SHOPEE</p>
                <div className='flex cursor-pointer mt-3 rounded'>
                    <img src={qr} alt="" />
                    <div className='flex flex-col gap-y-3 ml-2'>
                        <img className='bg-white p-1 rounded' src={appstore} alt="" />
                        <img className='bg-white p-1 rounded' src={ggPlay} alt="" />
                        <img className='bg-white p-1 rounded' src={appGallery} alt="" />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer