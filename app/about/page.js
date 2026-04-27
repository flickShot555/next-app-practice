'use client';

export default function About() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>About Me</h1>
      
      <section style={{ marginTop: '30px' }}>
        <h2>Welcome</h2>
        <p>
          Hi! I&apos;m a passionate developer with expertise in building modern web applications.
          I love creating intuitive user experiences and writing clean, maintainable code.
        </p>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>Skills</h2>
        <ul>
          <li>JavaScript & TypeScript</li>
          <li>React & Next.js</li>
          <li>Frontend Development</li>
          <li>Web Design</li>
          <li>Full-stack Development</li>
        </ul>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>Experience</h2>
        <p>
          With over 5 years of experience in web development, I&apos;ve worked on various projects
          ranging from small startups to large-scale applications. I&apos;m committed to continuous
          learning and staying updated with the latest technologies.
        </p>
      </section>

      <section style={{ marginTop: '30px' }}>
        <h2>Get In Touch</h2>
        <p>
          Feel free to reach out to me for collaborations or just a friendly hello!
        </p>
      </section>
    </div>
  );
}

