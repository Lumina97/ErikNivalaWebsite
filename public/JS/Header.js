class MyHeader extends HTMLElement{
    connectedCallback() {
        this.innerHTML = `    
        <body class="Header">
        <nav class="navMenu">
          <a class="HeaderNav" href="/ImageGatherer">Image Gatherer</a>
          <a class="HeaderNav" href="/About">About</a>
        </nav>
      </body>        
        `
    }

}

customElements.define("my-header", MyHeader)