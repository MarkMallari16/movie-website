import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch';
import BackButton from '../components/BackButton';
import { formattedAge, formattedDate } from '../utils/dateFormatUtils';
import LoadingComponent from '../components/LoadingComponent';
import { motion } from 'framer-motion';
import MovieSmallCard from '../components/MovieSmallCard';
import { FaImdb, FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { FaSquareInstagram } from "react-icons/fa6";


const PersonPage = () => {
  const [isShowFullText, setIsShowFullText] = useState(false);

  const { id } = useParams();

  const { data: personData, loading: personLoading } = useFetch(`https://api.themoviedb.org/3/person/${id}`);
  const { data: movieCreditsData, loading: movieCreditsLoading } = useFetch(`https://api.themoviedb.org/3/person/${id}/movie_credits`);
  const { data: externalIdsData, loading: externalIdsLoading } = useFetch(`https://api.themoviedb.org/3/person/${id}/external_ids`);

  if (personLoading || movieCreditsLoading || externalIdsLoading) {
    return <LoadingComponent />
  }

  console.log(externalIdsData);
  const truncatedBiographyText = personData.biography.slice(0, 300);
  const shouldShowFullText = personData.biography.length > truncatedBiographyText.length;

  const handleToggleText = () => {
    setIsShowFullText(!isShowFullText);
  }
  const personBirthDate = formattedDate(personData.birthday);
  const personAge = formattedAge(personData.birthday);

  const rotatedChevron = {
    unrotated: { rotate: 0 },
    rotated: { rotate: isShowFullText ? -180 : 0 }
  }

  const SOCIAL_MEDIA_LINKS = [
    {
      id: externalIdsData.imdb_id,
      linkPath: `https://www.imdb.com/name/${externalIdsData?.imdb_id}`,
      icon: <FaImdb />,
      tooltip: "Visit IMDB ID"
    },
    {
      id: externalIdsData.twitter_id,
      linkPath: `https://twitter.com/${externalIdsData?.twitter_id}`,
      icon: <RiTwitterXLine />,
      tooltip: "Visit X"
    },
    {
      id: externalIdsData.instagram_id,
      linkPath: `https://www.instagram.com/${externalIdsData?.instagram_id}`,
      icon: <FaInstagram />,
      tooltip: "Visit Instagram"
    },
    {
      id: externalIdsData.facebook_id,
      linkPath: `https://www.facebook.com/${externalIdsData?.facebook_id}`,
      icon: <FaFacebookSquare />,
      tooltip: "Visit Facebook"
    },
  ]
  const filteredSocialMedia = SOCIAL_MEDIA_LINKS.filter(socialMedia => socialMedia?.id);

  return (
    <div className='lg:mt-32 mx-12'>

      <div className='flex flex-wrap lg:flex-nowrap gap-16 '>
        <img src={`https://image.tmdb.org/t/p/w500${personData.profile_path}`} alt={personData.name} className='rounded-lg w-full lg:w-auto lg:h-96' />
        <div>
          <h1 className='text-5xl lg:text-6xl font-semibold'>{personData.name}</h1>
          <div>
            <div>
              <p className='mt-2 tracking-wide'>Known for {personData.known_for_department}</p>
            </div>
            <div className='mt-2 flex items-center gap-1'>
              <p> Born in {personBirthDate} {personAge}</p>
            </div>
            {
              personData.biography && (
                <>
                  <h2 className='text-xl font-medium mt-4'>Biography</h2>
                  <p className='mt-2 tracking-wide'>
                    {isShowFullText ? personData.biography : `${truncatedBiographyText}...`}
                  </p>
                  <p className='w-28'>
                    {shouldShowFullText && (
                      <span
                        onClick={handleToggleText}
                        className='flex gap-1 cursor-pointer  text-blue-500 font-medium'
                      >
                        {isShowFullText ? 'See Less' : 'See More'}
                        <motion.svg
                          initial="unrotated"
                          animate={isShowFullText ? "rotated" : "unrotated"}
                          variants={rotatedChevron}
                          transition={{ ease: 'easeOut',duration: 0.3 }}
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                          <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                        </motion.svg>

                      </span>
                    )}
                  </p>
                </>
              )
            }
            {externalIdsData && (
              <div className='mt-4'>
                <h2 className='text-xl font-medium'>Social Links</h2>
                <div className='flex items-center gap-4 mt-2'>
                  {filteredSocialMedia.map((socialMedia, _) => (
                    <a key={socialMedia?.id} href={socialMedia?.linkPath} target='_blank' rel='noopener noreferrer' className='tooltip' data-tip={socialMedia.tooltip}>
                      <span className='text-2xl'>
                        {socialMedia.icon}
                      </span>
                    </a>
                  ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <div className='mt-12'>
        <h2 className='text-2xl font-semibold'>Known For</h2>

        <div className="mt-8 gap-6 flex carousel carousel-end rounded-box w-full [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
          <div className="carousel-item space-x-5">
            {movieCreditsData.cast.map(movie => (
              <MovieSmallCard
                key={movie.id}
                id={movie.id}
                poster={movie.poster_path}
                rate={movie.vote_average}
                releaseDate={new Date(movie.release_date).getFullYear()}
                title={movie.title}
                type="movie"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonPage