type Props = {
  tag: string;
};

export function Tag(props: Props) {
  const tag = tags[props.tag as keyof typeof tags];
  return (
    <span
      className="tag"
      style={{
        color: tag.text,
        background: tag.color,
        padding: "2px",
        margin: "2px",
      }}
    >
      {props.tag}
    </span>
  );
}
const tags = {
  Architecture: {
    color: "blue",
    text: "white",
  },
  Art: {
    color: "yellow",
    text: "black",
  },
  Business: {
    color: "purple",
    text: "white",
  },
  "Computer Science": {
    color: "Chocolate",
    text: "white",
  },
  Dreamer: {
    color: "#1abc9c",
    text: "black",
  },
  Engineering: {
    color: "orange",
    text: "black",
  },
  Journalism: {
    color: "tomato",
    text: "black",
  },
  Large: {
    color: "LightSalmon",
    text: "black",
  },
  Midwest: {
    color: "FireBrick",
    text: "white",
  },
  Military: {
    color: "PapayaWhip",
    text: "black",
  },
  Music: {
    color: "DarkKhaki",
    text: "black",
  },
  Northeast: {
    color: "Lavender",
    text: "black",
  },
  Nursing: {
    color: "Fuchsia",
    text: "black",
  },
  Small: {
    color: "SlateBlue",
    text: "white",
  },
  South: {
    color: "GreenYellow",
    text: "black",
  },
  West: {
    color: "Teal",
    text: "white",
  },
  Womens: {
    color: "LightCyan",
    text: "black",
  },
};
