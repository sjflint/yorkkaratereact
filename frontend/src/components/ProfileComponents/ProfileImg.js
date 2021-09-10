import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfileImg } from "../../actions/memberActions";

const ProfileImg = () => {
  const dispatch = useDispatch();

  const [uploadFile, setUploadFile] = useState("");

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const onChange = async (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0].size < 100000) {
      setUploadFile(e.target.files[0]);
    } else {
      alert("File size must be less than 1MB");
    }
  };

  if (uploadFile) {
    dispatch(uploadProfileImg(uploadFile));
    setUploadFile("");
  }

  useEffect(() => {}, [dispatch, uploadFile]);

  return (
    <>
      <img src={member.profileImg} alt={member.name} className="mb-2" />
      <Form className="text-primary pb-3 border-bottom border-warning">
        <label className="d-block btn-primary py-2 my-0 text-center custom-fileupload-button text-warning">
          <input type="file" name="image" onChange={onChange} />
          Change Profile Image
        </label>
      </Form>
    </>
  );
};

export default ProfileImg;
