import React from 'react';
import { IPhoto, IDecoded, IUser } from '../interfaces';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { IGlobalState } from '../reducers';
import { Link } from 'react-router-dom';




interface IPropsGlobal{
    photos: IPhoto[];
    decoded: IDecoded;
    token: string;
    users:IUser[]
    
}

const UserPhotoDetail: React.FC<IPropsGlobal & RouteComponentProps<{photoId: string}>> = props => {
    const user = props.users.find(u => u._id === props.decoded._id);
    const {Icon} = require("react-materialize");
    const myPhoto = props.photos.find(p => p._id === props.match.params.photoId)

    if(!myPhoto){
        return null
    }
    if (!user) {
        return null;
      }
    
    return(
    <div className="section container">
        <Link to={"/users/" + myPhoto.owner + "/userDetail"}>
      <Icon>close</Icon>
      </Link>
        <div className="row">
            <div className="col s12">
            
                
        <img width="100%" src={"http://localhost:8080/uploads/photos/" + myPhoto.filename} alt="photo"/>
        </div>
        
        
        <h6>Title</h6>
        <p>{myPhoto.name}</p>
        <h6>Camera</h6>
        <p>{myPhoto.camera}</p>
        <h6>Localization</h6>
        <p>{myPhoto.localization}</p>
        </div>
        
        
        
        
        
        
    </div>
    )
}
const mapStateToProps = (state: IGlobalState) => ({
    photos: state.photos,
    decoded:state.decoded,
    token:state.token,
    users: state.users
});

export default connect(mapStateToProps) (UserPhotoDetail);