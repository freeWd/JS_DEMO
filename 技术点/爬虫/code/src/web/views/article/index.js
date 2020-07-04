"use strict";

class ArticleContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
    };
  }

  componentDidMount() {
    const id = window.location.search.split("=")[1];
    this.getArticleContentById(id);
  }

  getArticleContentById(id) {
    fetch("../api/getArticleContent?id=" + id)
      .then((resp) => resp.json())
      .then((result) => {
        this.setState({
            content: result.data
        })
      });
  }

  render() {
    return <div className="m" dangerouslySetInnerHTML={{ __html: this.state.content }}></div>;
  }
}

const domContainer = document.querySelector("#article-content");
ReactDOM.render(<ArticleContent />, domContainer);
