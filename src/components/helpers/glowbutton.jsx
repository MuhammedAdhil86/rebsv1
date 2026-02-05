import "./GlowButton.css";

export default function GlowButton({ children = "Edit in Chat", onClick }) {
  return (
    <button className="chat-btn" onClick={onClick}>
      <span className="label">{children}</span>
      <span className="glow" />
    </button>
  );
}
