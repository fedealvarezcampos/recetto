import Image from 'next/image';
import Slider from 'react-slick';
import { supabaseHost } from '../lib/constants';

import styles from '../styles/RecipeGallery.module.scss';

const settings = {
    className: 'center',
    centerMode: true,
    infinite: true,
    centerPadding: '60px',
    slidesToShow: 1,
    speed: 500,
    adaptiveHeight: true,
    responsive: [
        {
            breakpoint: 1500,
            settings: {
                centerPadding: '30px',
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: false,
            },
        },
        {
            breakpoint: 1000,
            settings: {
                centerPadding: '20px',
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
                dots: false,
            },
        },
        {
            breakpoint: 700,
            settings: {
                centerPadding: '20px',
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 2,
            },
        },
        {
            breakpoint: 500,
            settings: {
                centerPadding: '12px',
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 2,
            },
        },
    ],
};

function RecipeGallery({ items }) {
    return (
        <>
            <div className={styles.galleryContainer}>
                {items?.length > 1 && (
                    <Slider {...settings}>
                        {items?.map((img, i) => (
                            <div key={i} className={styles.imageContainer}>
                                <Image
                                    src={supabaseHost + img}
                                    // placeholder="blur"
                                    priority
                                    layout="responsive"
                                    width="100%"
                                    height="80%"
                                    objectFit="cover"
                                    quality={80}
                                    alt="recipe images"
                                />
                            </div>
                        ))}
                    </Slider>
                )}
                {items?.length <= 1 && (
                    <Image
                        src={supabaseHost + items[0]}
                        // placeholder="blur"
                        priority
                        layout="responsive"
                        width="100%"
                        height="80%"
                        objectFit="cover"
                        quality={80}
                        alt="recipe images"
                    />
                )}
            </div>
        </>
    );
}

export default RecipeGallery;
