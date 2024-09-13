// tagMapping.js
import React from 'react';

const tagMapping = {
    // Common tags
    li: (props) => (
        <li className="d-flex align-items-start mb-2 trf" {...props} />
    ),
    a: (props) => <a {...props} />,
    p: (props) => <p {...props} />,
    strong: (props) => <strong {...props} />,
    em: (props) => <em {...props} />,
    br: () => <br />,
    span: (props) => <span {...props} />,
    div: (props) => <div {...props} />,
    h1: (props) => <h1 {...props} />,
    h2: (props) => <h2 {...props} />,
    h3: (props) => <h3 {...props} />,
    h4: (props) => <h4 {...props} />,
    h5: (props) => <h5 {...props} />,
    h6: (props) => <h6 {...props} />,
    img: (props) => <img {...props} />,
    ul: (props) => <ul {...props} />,
    ol: (props) => <ol {...props} />,
    table: (props) => <table {...props} />,
    thead: (props) => <thead {...props} />,
    tbody: (props) => <tbody {...props} />,
    tr: (props) => <tr {...props} />,
    th: (props) => <th {...props} />,
    td: (props) => <td {...props} />,
    form: (props) => <form {...props} />,
    input: (props) => <input {...props} />,
    textarea: (props) => <textarea {...props} />,
    button: (props) => <button {...props} />,
    label: (props) => <label {...props} />,
    select: (props) => <select {...props} />,
    option: (props) => <option {...props} />,
    iframe: (props) => <iframe {...props} />,
    video: (props) => <video {...props} />,
    audio: (props) => <audio {...props} />,
    source: (props) => <source {...props} />,
    track: (props) => <track {...props} />,
    details: (props) => <details {...props} />,
    summary: (props) => <summary {...props} />,
    code: (props) => <code {...props} />,
    pre: (props) => <pre {...props} />,
    blockquote: (props) => <blockquote {...props} />,
    cite: (props) => <cite {...props} />,
    address: (props) => <address {...props} />,
};

export default tagMapping;
