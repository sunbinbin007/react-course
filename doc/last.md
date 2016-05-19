#深入理解 React

###原型开始

![image](http://reactjs.cn/react/img/blog/thinking-in-react-mock.png)

    [
      {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
      {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
      {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
      {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
      {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
      {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
    ];

###第一步：拆分用户界面为一个组件库

单一功能原则，指的是，理想状态下一个组件应该只做一件事，假如它功能逐渐变大就需要被拆分成更小的子组件。
![image](http://reactjs.cn/react/img/blog/thinking-in-react-components.png)

由此可见，我们的 app 中包含五个组件。下面我已经用斜体标示出每个组件对应的数据。

1. FilterableProductTable （橘色）： 包含整个例子的容器
2. SearchBar （蓝色）： 接受所有 用户输入（ user input ）
3. ProductTable （绿色）： 根据 用户输入（ user input ）过滤和展示 数据集合（ data collection ）
4. ProductCategoryRow （青色）： 为每个 分类（ category ） 展示一列表头
5. ProductRow （红色）： 为每个 产品（ product ） 展示一列

+ FilterableProductTable
    + SearchBar
    + ProductTable
        + ProductCategoryRow
        + ProductRow

###第二步：利用 React，创建应用的一个静态版本

    var ProductCategoryRow = React.createClass({
      render: function() {
        return (<tr><th colSpan="2">{this.props.category}</th></tr>);
      }
    });

    var ProductRow = React.createClass({
      render: function() {
        var name = this.props.product.stocked ?
          this.props.product.name :
          <span style={{color: 'red'}}>
            {this.props.product.name}
          </span>;
        return (
          <tr>
            <td>{name}</td>
            <td>{this.props.product.price}</td>
          </tr>
        );
      }
    });

    var ProductTable = React.createClass({
      render: function() {
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
          if (product.category !== lastCategory) {
            rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
          }
          rows.push(<ProductRow product={product} key={product.name} />);
          lastCategory = product.category;
        });
        return (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        );
      }
    });

    var SearchBar = React.createClass({
      render: function() {
        return (
          <form>
            <input type="text" placeholder="Search..." />
            <p>
              <input type="checkbox" />
              {' '}
              Only show products in stock
            </p>
          </form>
        );
      }
    });

    var FilterableProductTable = React.createClass({
      render: function() {
        return (
          <div>
            <SearchBar />
            <ProductTable products={this.props.products} />
          </div>
        );
      }
    });


    var PRODUCTS = [
      {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
      {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
      {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
      {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
      {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
      {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
    ];
     
    ReactDOM.render(
      <FilterableProductTable products={PRODUCTS} />,
      document.getElementById('container')
    );

最简单的方式就是创建一个应用，这个应用将数据模型渲染到 UI 上，但是没有交互功能。拆分这两个过程是最简单的，因为构建一个静态的版本仅需要大量的输入，而不需要思考；但是添加交互功能却需要大量的思考和少量的输入。

> props 是一种从父级向子级传递数据的方式。
> state 仅用于实现交互功能，也就是说，数据随着时间变化。
> 因为这是一个静态的应用版本，所以你并不需要 state 。

###第三步：识别出最小的（但是完整的）代表 UI 的 state

思考示例应用中的所有数据片段，有：

+ 最初的 products 列表
+ 用户输入的搜索文本
+ 复选框的值
+ 过滤后的 products 列表

state 有：

+ 用户输入的搜索文本
+ 复选框的值

###第四步：确认 state 隶属于哪个组件

    var ProductCategoryRow = React.createClass({
      render: function() {
        return (<tr><th colSpan="2">{this.props.category}</th></tr>);
      }
    });

    var ProductRow = React.createClass({
      render: function() {
        var name = this.props.product.stocked ?
          this.props.product.name :
          <span style={{color: 'red'}}>
            {this.props.product.name}
          </span>;
        return (
          <tr>
            <td>{name}</td>
            <td>{this.props.product.price}</td>
          </tr>
        );
      }
    });

指出哪个组件会改变或者说拥有这个 state 数据模型。

我们决定了 state 数据模型位于 FilterableProductTable 之中。
> 添加 getInitialState() 方法
> 传递 filterText 和 inStockOnly 给 ProductTable 和 SearchBar 作为 prop 

###第五步：添加反向数据流

    var ProductCategoryRow = React.createClass({
      render: function() {
        return (<tr><th colSpan="2">{this.props.category}</th></tr>);
      }
    });

    var ProductRow = React.createClass({
      render: function() {
        var name = this.props.product.stocked ?
          this.props.product.name :
          <span style={{color: 'red'}}>
            {this.props.product.name}
          </span>;
        return (
          <tr>
            <td>{name}</td>
            <td>{this.props.product.price}</td>
          </tr>
        );
      }
    });

    var ProductTable = React.createClass({
      render: function() {
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach(function(product) {
          if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
            return;
          }
          if (product.category !== lastCategory) {
            rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
          }
          rows.push(<ProductRow product={product} key={product.name} />);
          lastCategory = product.category;
        }.bind(this));
        return (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        );
      }
    });

    var SearchBar = React.createClass({
      handleChange: function() {
        this.props.onUserInput(
          this.refs.filterTextInput.value,
          this.refs.inStockOnlyInput.checked
        );
      },
      render: function() {
        return (
          <form>
            <input
              type="text"
              placeholder="Search..."
              value={this.props.filterText}
              ref="filterTextInput"
              onChange={this.handleChange}
            />
            <p>
              <input
                type="checkbox"
                checked={this.props.inStockOnly}
                ref="inStockOnlyInput"
                onChange={this.handleChange}
              />
              {' '}
              Only show products in stock
            </p>
          </form>
        );
      }
    });

    var FilterableProductTable = React.createClass({
      getInitialState: function() {
        return {
          filterText: '',
          inStockOnly: false
        };
      },

      handleUserInput: function(filterText, inStockOnly) {
        this.setState({
          filterText: filterText,
          inStockOnly: inStockOnly
        });
      },

      render: function() {
        return (
          <div>
            <SearchBar
              filterText={this.state.filterText}
              inStockOnly={this.state.inStockOnly}
              onUserInput={this.handleUserInput}
            />
            <ProductTable
              products={this.props.products}
              filterText={this.state.filterText}
              inStockOnly={this.state.inStockOnly}
            />
          </div>
        );
      }
    });


    var PRODUCTS = [
      {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
      {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
      {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
      {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
      {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
      {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
    ];

    ReactDOM.render(
      <FilterableProductTable products={PRODUCTS} />,
      document.getElementById('container')
    );

另外一种数据流动方式了：组件树中层级很深的表单组件需要更新 FilterableProductTable 中的 state 。

由于组件只能更新自己的 state ， FilterableProductTable 将会传递一个回调函数给 SearchBar ，此函数将会在 state 应该被改变的时候触发。我们可以使用 input 的 onChange 事件来监听用户输入，从而确定何时触发回调函数。 FilterableProductTable 传递的回调函数将会调用 setState() ，然后应用将会被更新。























