import Image from "next/image";

const photos = [
  { src: "/photos/1.webp", label: "Moment 01", alt: "Travel photograph 1" },
  { src: "/photos/2.webp", label: "Moment 02", alt: "Travel photograph 2" },
  { src: "/photos/3.webp", label: "Moment 03", alt: "Travel photograph 3" },
  { src: "/photos/4.webp", label: "Moment 04", alt: "Travel photograph 4" },
  { src: "/photos/5.webp", label: "Moment 05", alt: "Travel photograph 5" },
  { src: "/photos/6.webp", label: "Moment 06", alt: "Travel photograph 6" },
  { src: "/photos/10.webp", label: "Moment 07", alt: "Travel photograph 7" },
  { src: "/photos/8.webp", label: "Moment 08", alt: "Travel photograph 8" },
  { src: "/photos/9.webp", label: "Moment 09", alt: "Travel photograph 9" },
];

export default function PhotosApp() {
  return (
    <div className="photosApp appPane">
      <div className="photoHeader">
        <div>
          <p className="appKicker">Photo stream</p>
          <h1>Polaroids.</h1>
        </div>
        <span>{photos.length} moments</span>
      </div>
      <div className="photoGrid">
        {photos.map((photo, index) => (
          <figure key={photo.src}>
            <div className="photoImage">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 760px) 50vw, 260px"
                unoptimized
              />
            </div>
            <figcaption>
              <span>{photo.label}</span>
              <small>{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
