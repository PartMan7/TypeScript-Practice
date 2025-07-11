import '@/index.css';

const pref = localStorage.getItem('theme');
if (pref === 'light') document.body.classList.add('light');
else document.body.classList.add('dark');
setTimeout(() => document.body.classList.add('duration-400'), 0);
