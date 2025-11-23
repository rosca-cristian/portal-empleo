import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
    text: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
    cursor?: boolean;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
    text,
    speed = 50,
    delay = 0,
    onComplete,
    cursor = true
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setStarted(true);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [started, text, speed, onComplete]);

    return (
        <span>
            {displayedText}
            {cursor && <span className="cursor">|</span>}
        </span>
    );
};

export default TypewriterEffect;
