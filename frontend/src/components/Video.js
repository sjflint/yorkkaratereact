const Video = ({ poster, mp4, webmhd, ogv }) => {
  return (
    <video
      width="100%"
      controls
      poster={poster}
      className="border border-warning rounded"
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
    >
      <source src={mp4} />
      <source src={webmhd} />
      <source src={ogv} />
      Your browser does not support HTML video
    </video>
  );
};

export default Video;
