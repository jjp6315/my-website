const photos = [
  "After rain",
  "Westward",
  "Blue hour",
  "Long way home",
  "Quiet geometry",
  "Last light",
];

export default function PhotosApp() {
  return (
    <div className="photosApp appPane">
      <div className="photoHeader">
        <div>
          <p className="appKicker">Photo stream</p>
          <h1>Places I paused.</h1>
        </div>
        <span>{photos.length} moments</span>
      </div>
      <div className="photoGrid">
        {photos.map((label, index) => (
          <figure key={label} className={`photo${index + 1}`}>
            <div />
            <figcaption>
              <span>{label}</span>
              <small>0{index + 1} / 06</small>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
