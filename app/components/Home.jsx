import React from 'react';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import __ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filesImage: []
    }
  }
  addNewFile(target) {
    let filesImage = this.state.filesImage;
    let that = this;
    if(target.files.length){
      __.forEach(target.files,(file,idx) =>{
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            if(e.target.result){
              filesImage.push({
                    file:e.target.result,
                    fileName: file.name,
                    type: file.type
                  });
              that.setState({filesImage:filesImage});
            }
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      });
    }
  }
  add() {
    let info ={};
    info.images = this.state.filesImage
    if(this.props.insertStockModel){
      console.log(info);
      this.props.insertStockModel(JSON.stringify(info)).then(({data}) => {
        console.log(data);
      })
    }
  }
  render() {
    return (
      <div>
        <input type="file" onChange={({target}) => this.addNewFile(target)} />
        <button onClick={() => this.add()}>send</button>
      </div>
    )
  }
}
const INSERT_STOCKMODEL = gql`
    mutation insertStockModel($info:String) {
      insertStockModel(info:$info)
    }
`;
export default compose(
  graphql(INSERT_STOCKMODEL,{
      props:({mutate})=>({
      insertStockModel : (info) =>mutate({variables:{info}})
    })
  })
)(Home);
