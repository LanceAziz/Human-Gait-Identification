'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/swiper-bundle.css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import styles from "./Home.module.css"
import Card from '@/app/(components)/_card/page';


export default function Home() {
  const supervisorBasepath = '/Pictures/All-Team/Supervisors/'
  const supervisorsData = [
    { name: 'Prof. Dr. Alaa E. A. Ahmed', title: 'Project Supervisor', imageName: '1.png', vip: true },
    { name: 'T.A. Nada Yassine', title: 'Teacher Assistant', imageName: '', vip: false },
    { name: 'T.A. Mariam Essam', title: 'Teacher Assistant', imageName: '3.png', vip: false }
  ];
  const memberBasepath = '/Pictures/All-Team/Members/'
  const membersData = [
    { name: 'Lance Moheb Samir', title: 'Team Leader', imageName: '1.png', vip: true },
    { name: 'Seif Ibrahim Ezzat', title: 'Co-Lead', imageName: '2.png', vip: false },
    { name: 'Mina Nady Fawzy', title: 'Co-Lead', imageName: '3.png', vip: false },
    { name: 'Omar Mohmed Amin', title: 'Member', imageName: '4.png', vip: false },
    { name: 'Romario Nagy Samir', title: 'Member', imageName: '5.png', vip: false },
    { name: 'Hamza Tharwat Mohmed', title: 'Member', imageName: '6.png', vip: false },
    { name: 'Mohmed Youssef Mohmed', title: 'Member', imageName: '7.png', vip: false },
    { name: 'Ziad Diaa El Deen Mahmoud', title: 'Member', imageName: '8.png', vip: false }
  ];
  return (
    <>
      <div className="container px-5">
        <div className="row">
          <h1 className="text-center pt-4 pb-2">Human Gait Identification</h1>
          <p>Our graduation project focuses on gait analysis as a means of predicting a person&apos;s identity through their distinctive walking patterns. Gait recognition, an emerging field in biometrics, provides a non-intrusive and innovative approach to person identification. This project explores the feasibility and effectiveness of utilizing gait as a unique biometric identifier, contributing to advancements in security and authentication systems.</p>
          <h2 className="text-center pt-5 pe-3">Acknowledgement</h2>
          <p>We extend our deepest appreciation for the guidance and mentorship of:</p>
          <Swiper
            effect={'coverflow'} grabCursor={true} centeredSlides={true} loop={true} slidesPerView={'auto'}
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false }}
            pagination={{ el: '.swiper-pagination', clickable: true }}
            navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="swiper_container">
            <div className="container">
              <div className="row">
                {
                  supervisorsData.map((person, index) => {
                    const profilePic = `${supervisorBasepath}${person.imageName}`;
                    return (
                      <SwiperSlide key={index} className='col-xl-4 col-md-6 col-sm-12 w-auto'>
                        <Card personData={person} image={profilePic} />
                      </SwiperSlide>
                    )
                  })
                }
              </div>
            </div >

            <div className="slider-controler">
              <div className="swiper-button-prev text-white">
              </div>
              <div className="swiper-button-next text-white">
              </div>
            </div>
          </Swiper>
          <p className="pt-2">Additionally, Our team members who played pivotal roles in the project&apos;s success:</p>
          <Swiper
            effect={'coverflow'} grabCursor={true} centeredSlides={true} loop={true} slidesPerView={'auto'}
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false }}
            pagination={{ el: '.swiper-pagination', clickable: true }}
            navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="swiper_container">
            <div className="container">
              <div className="row">
                {
                  membersData.map((person, index) => {
                    const profilePic = `${memberBasepath}${person.imageName}`;
                    return (
                      <SwiperSlide key={index} className='col-xl-4 col-md-6 col-sm-12 w-auto'>
                        <Card personData={person} image={profilePic} />
                      </SwiperSlide>
                    )
                  })
                }
              </div>
            </div >

            <div className="slider-controler">
              <div className="swiper-button-prev text-white">
              </div>
              <div className="swiper-button-next text-white">
              </div>
            </div>
          </Swiper>
        </div>
      </div >
    </>
  );
}