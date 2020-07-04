"use strict";

const { List, Pagination, Tag } = antd;

class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 10,
      pageIndex: 1,
      total: 0,
      data: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getArticleList();
  }

  getArticleList() {
    this.setState({ loading: true });
    const { pageSize, pageIndex } = this.state;
    fetch(`../api/getArticleList?pageSize=${pageSize}&pageIndex=${pageIndex}`)
      .then((resp) => resp.json())
      .then((result) => {
        this.setState({
          loading: false,
          data: result.data,
          total: result.total
        });
      });
  }

  changePage = (page) => {
    this.setState({
      pageIndex: page,
    });
    this.getArticleList();
  };

  render() {
    return (
      <div className="m">
        <List
          loading={this.state.loading}
          dataSource={this.state.data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                title={
                  <a href={"../article/?id=" + item.id}>{item.title}</a>
                }
                description={
                  <div>
                    <p>作者：{item.author}</p>
                    <p>
                      标签：
                      {item.tags.map((tagItem, index) => (
                        <Tag color="#2db7f5" key={index}>
                          {tagItem}
                        </Tag>
                      ))}
                    </p>
                  </div>
                }
              />
            </List.Item>
          )}
        >
        </List>
        <Pagination
          className="text-center"
          current={this.state.pageIndex}
          onChange={this.changePage}
          total={this.state.total}
        />
      </div>
    );
  }
}

const domContainer = document.querySelector("#article-list");
ReactDOM.render(<ArticleList />, domContainer);
