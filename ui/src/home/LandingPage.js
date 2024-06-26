import React from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './LandingPage.css'; // Import CSS file for styling

const LandingPage = () => {
    return (
        <Swiper
            // spaceBetween={50}
            slidesPerView={1}
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            navigation
            pagination={{ clickable: true }}
            // scrollbar={{ draggable: true }}
            onSlideChange={(swiper) => {
                // if (swiper.activeIndex === swiper.slides.length - 1) {
                //     window.location.href = '/signin';
                // }
            }}
        >
            <SwiperSlide>
                <div className="slide">
                    <video src="./media/UrlStats.mp4" controls></video>
                    <p>Feature 1: Activity Stats</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="slide">
                    <video src="./media/ReachStats.mp4" controls></video>
                    <p>Feature 2: Reach Stats</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="slide">
                    <video src="./media/Control.mp4" controls></video>
                    <p>Feature 3: URL info</p>
                </div>
            </SwiperSlide>
            <SwiperSlide>
                <div className="slide">
                    <img src="./media/EmailNotification.png" alt="Email Notifications"/>
                    <p>Feature 4: Email Notifications</p>
                </div>
            </SwiperSlide>
        </Swiper>
    );
};

export default LandingPage;
