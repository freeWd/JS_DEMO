"use strict";

const { Card, Col, Row, Tag } = antd;

class TagCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
    };
  }

  componentDidMount() {
    this.getTagList();
  }

  getTagList() {
    fetch("../api/getTagList")
      .then((resp) => resp.json())
      .then((data) => {
        this.setState({
          loading: false,
          data: data,
        });
      });
  }

  render() {
    const tagList = this.state.data;

    return (
      <div className="m">
        <Row gutter={16}>
          {tagList.map((tagItem) => (
            <Col className="m" span={4} key={tagItem.id}>
              <Card title={<div className="title"><img className="img-title" src={tagItem.image}/> {tagItem.name}</div>} extra={<a href="../../article-list">文章列表</a>} size="small">
                <p>
                  <Tag color="#55acee">
                    文章数:  {tagItem.article}
                  </Tag>
                </p>
                <p> 
                  <Tag color="#3b5999">
                    收藏数: {tagItem.subscribe}
                  </Tag>
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

const domContainer = document.querySelector("#tag-card");
ReactDOM.render(<TagCard />, domContainer);
