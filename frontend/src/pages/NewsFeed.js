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
        <div>
          <h1>News Feed</h1>
          {news.length ? (
            <ul>
              {news.map((item, index) => (
                <li key={index} className="news-item">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <h2>{item.title}</h2>
                  </a>
                  <p>{item.description}</p>
                  <img src={item.imageSrc} alt={item.title} />
                  {/* Optionally, display the author info and publish date if you have those details */}
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