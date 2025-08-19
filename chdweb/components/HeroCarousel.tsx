import React from "react";

const images = [
  "/images/shamponing-new.jpg",
  "/images/maciage-new.jpg",
  "/images/gels-new.jpg",
  "/images/parfum-new.jpg",
  "/images/sacochette-new.jpg",
  "/images/coiffeur-new.jpg",
];

export default function HeroCarousel() {
  const quantity = images.length;
  return (
    <div className="wrapper" style={{ direction: "ltr" }}>
      <div
        className="inner"
        style={{
          //@ts-ignore
          "--quantity": quantity,
        } as React.CSSProperties}
      >
        {images.map((img, i) => (
          <div
            className="card"
            key={i}
            style={{
              //@ts-ignore
              "--index": i,
              "--quantity": quantity,
              "--color-card": "236, 72, 153", // pink-500
            } as React.CSSProperties}
          >
            <img src={img} alt="category" className="img" />
          </div>
        ))}
      </div>
      <style jsx>{`
        .wrapper {
          width: 100%;
          height: 220px;
          position: relative;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .inner {
          --w: 100px;
          --h: 150px;
          --translateZ: calc((var(--w) + var(--h)) + 0px);
          --rotateX: -15deg;
          --perspective: 1000px;
          position: absolute;
          width: var(--w);
          height: var(--h);
          top: 25%;
          left: calc(50% - (var(--w) / 2) - 2.5px);
          z-index: 2;
          transform-style: preserve-3d;
          transform: perspective(var(--perspective));
          animation: rotating 20s linear infinite;
        }
        @keyframes rotating {
          from {
            transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0);
          }
          to {
            transform: perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(1turn);
          }
        }
        .card {
          position: absolute;
          border: 2px solid rgba(var(--color-card));
          border-radius: 12px;
          overflow: hidden;
          inset: 0;
          transform: rotateY(calc((360deg / var(--quantity)) * var(--index))) translateZ(var(--translateZ));
        }
        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #0000 radial-gradient(circle, rgba(var(--color-card), 0.2) 0%, rgba(var(--color-card), 0.6) 80%, rgba(var(--color-card), 0.9) 100%);
        }
      `}</style>
    </div>
  );
}
