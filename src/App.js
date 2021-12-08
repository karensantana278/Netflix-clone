import React, {useEffect, useState} from 'react';
import './App.css'
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';



export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false)


  useEffect(()=>{
    const loadAll = async () => {
      //pegando a lista Total
      let list = await Tmdb.getHomeList();
      setMovieList(list)

      //pegando o filme destaque featuredData
      let originals = list.filter(i => i.slug === 'originais')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')
      
      setFeaturedData(chosenInfo);

    }
  
    loadAll()
  }, []);

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true)
      }else{
        setBlackHeader(false)
      }
    }

    window.addEventListener('scroll', scrollListener)

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }

  }, [])

  return (
    <div className="page">

      <Header black={blackHeader}/>

      { featuredData && 
      <FeaturedMovie item={featuredData}/>
        }
      

      <section className="lists">
        {movieList.map((item, key) =>(
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
        Feito para estudo de react, todos os direitos das imagens são da Netflix.
        <br/>
        Dados Extraídos da api https://www.themoviedb.org/
      </footer>
    </div>
  )
}