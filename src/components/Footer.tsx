const footer: React.CSSProperties = {
  position: 'fixed',
  left: '0',
  bottom: '0',
  width: '100%',
}

export default function Footer() {
  return (
    <div style={footer} className="ui inverted vertical segment">
      <div className="ui container">
        <a
          className="ui secondary button"
          href="https://github.com/brandon-drakeford"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="github icon"></i> Github Portfolio
        </a>
      </div>
    </div>
  )
}
