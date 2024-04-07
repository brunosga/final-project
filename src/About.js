// Import necessary dependencies
import React from "react";
import './css/About.css'

const About = () => {
    return (
        <div className="about-us-container">
          <h1>About Us</h1>
          <section className="about-us-story">
            <h2>Our Story</h2>
            <p>
              It all began with a light-hearted conversation about the luxury of having a Michelin-starred chef prepare a meal in the comfort of our own home. That whimsical idea sparked a realization: Why not make it a reality? Our founder, inspired by this dream, embarked on a mission to bring gourmet experiences to your dining table.
            </p>
            <p>
              Starting as a personal chef for his friends, our journey was met with enthusiasm and delight, igniting the concept of Dining In. Today, we are proud to present a platform where food enthusiasts can discover chefs of varied specialties, inviting you to a world where flavors know no bounds and dining becomes an adventure within your own walls.
            </p>
          </section>
          <section className="about-us-mission">
            <h2>Our Mission</h2>
            <p>
              At Dining In, our mission is simple: to revolutionize the way you experience food. We believe that every meal should be a celebration, an exploration, and a treasure driven by sensory delights. With a curated selection of chefs who are artists in their own right, we're dedicated to making every bite to memorable memory.
            </p>
          </section>
          <section className="about-us-vision">
            <h2>Our Vision</h2>
            <p>
              We envision a world where fine dining is not confined to the traditional restaurant setting. Our vision is to democratize the gourmet experience, making it accessible, enjoyable, and uniquely personal. Dining In is not just about food; it's about the stories, the connections, and the memories we create together.
            </p>
          </section>
          <section className="about-us-values">
            <h2>Our Values</h2>
            <ul>
              <li><strong>Excellence:</strong> We strive for culinary perfection, from ingredient selection to presentation.</li>
              <li><strong>Connection:</strong> We build bridges between chefs and diners, fostering a community around a shared love of food.</li>
              <li><strong>Innovation:</strong> We constantly push the boundaries, seeking new ways to enhance your dining experience.</li>
            </ul>
          </section>
          <section className="about-us-chefs">
            <h2>Our Chefs</h2>
            <p>
              Behind every dish is a chef driven by passion and creativity. Our chefs are the heartbeat of Dining In, each with their own story, style, and signature touch. They're not just preparing meals; they're crafting experiences that stay with you long after the last bite.
            </p>
          </section>
          <section className="about-us-invitation">
            <h2>Join the Journey</h2>
            <p>
              Dining In is more than a service; it's a movement. And we invite you to be a part of it. Whether you're a chef looking to share your craft or a diner in search of new horizons, there's a place for you at our table. Welcome to Dining In! Where extraordinary meals make for unforgettable moments.
            </p>
          </section>
        </div>
      );
    };
    
    export default About; // Export the component for use in other parts of the app