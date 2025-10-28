import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./news-carousel.css";

export default function NewsCarousel() {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/news");
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };
    fetchNews();
  }, []);

  // Auto-slide
  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [news.length]);

  if (news.length === 0) return null;

  return (
    <section className="news-carousel-section">
      <h2 className="news-carousel-title">📰 Digital Hubs News Updates</h2>
      <div className="news-carousel-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="news-slide"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
          >
            <div className="news-image-container">
            <img
            src={news[currentIndex].imageUrl}
            alt={news[currentIndex].title}
            className="news-image"
          />

            </div>
            <div className="news-content">
              <h3>{news[currentIndex].title}</h3>
              <p>{news[currentIndex].description}</p>
              <span className="news-date">
                {new Date(news[currentIndex].publishedAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
