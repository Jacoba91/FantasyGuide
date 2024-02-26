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
        <div className="news-feed">
            <h1>News Feed</h1>
            {news.length ? (
                <ul>
                    {news.map((item, index) => (
                        <li key={index} className="news-item">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                                <h2>{item.title}</h2>
                            </a>
                            {item.image_src !== 'No Image' && (
                                <div className="news-image-container">
                                    <img src={item.image_src} alt={item.title} />
                                </div>
                            )}
                            <p className="news-description">{item.description}</p>
                            <div className="news-author-info">{item.author_info}</div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading news...</p>
            )}
        </div>
    );
};

export default NewsFeed;