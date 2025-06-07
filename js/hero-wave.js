export function initHeroWave() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const wave = hero.querySelector('.hero-text-wave');
    if (!wave) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        wave.style.setProperty('--cursor-x', `${x}px`);
        wave.style.setProperty('--cursor-y', `${y}px`);
    });

    hero.addEventListener('mouseleave', () => {
        wave.style.setProperty('--cursor-x', '50%');
        wave.style.setProperty('--cursor-y', '50%');
    });
}

document.addEventListener('DOMContentLoaded', initHeroWave);
