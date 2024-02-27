import { React, useEffect, useState } from 'react';
import './NewsFeed.css';

const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchNews = async () => {
        try {
          const response = await fetch('/news');
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setNews(data);
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchNews();
    }, []);
  
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    return (
        <div className="container"> 
          <div className="header">
            <h1>News Feed</h1> 
          </div>
          {news.length ? (
            <div className="card-container"> 
              {news.map((item, index) => (
                <div key={index} className="card"> 
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <img src={item.image_src !== 'No Image' ? item.image_src : 'placeholder-image.jpg'} alt={item.title} />
                    <div className="card-content">
                      <h2>{item.title}</h2>
                      <p className="news-description">{item.description}</p>
                    </div>
                  </a>
                  <div className="news-author-info">{item.author_info}</div> 
                </div>
              ))}
            </div>
          ) : (
            <p>Loading news...</p>
          )}
        </div>
    );
};

export default NewsFeed;