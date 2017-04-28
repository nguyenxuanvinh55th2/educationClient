import React from 'react';

import Dialog from 'material-ui/Dialog';

export default class PlayerImage extends React.Component {
    constructor(props) {
      super(props);
      this.state = { showModal: false };
    }

    render() {
      let { checkOutImage } = this.props;
      console.log('checkOutImage ', checkOutImage);
      return (
        <div style={{width: 50, height: 50}}>
          <img style={{height: 50, width: 50, borderRadius: '100%', maxWidth: '100%', maxHeight: '100%'}} src={checkOutImage} onClick={() => {
              this.setState({showModal: true});
            }}/>
          <Dialog
            modal={true}
            open={this.state.showModal}
            contentStyle={{height: 300, width: 245}}
          >
            <div className="modal-dialog" style={{width: 'auto', margin: 0}}>
                <div className="modal-content">
                  <div className="modal-body" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                    <div>
                      <span className="close" onClick={() => this.setState({showModal: false})}>&times;</span>
                    </div>
                      <img style={{height: 200, width: 200, maxWidth: '100%', maxHeight: '100%'}} src={checkOutImage}/>
                  </div>
                </div>
            </div>
          </Dialog>
        </div>
      )
    }
}
