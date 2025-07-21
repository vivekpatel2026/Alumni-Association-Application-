import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetSuccess } from "../../redux/slices/users/userSlices";
const SuccesMsg = ({ message }) => {
    const dispatch = useDispatch();
    Swal.fire({
        icon: "success",
        title: "Good Job",
        text: message,
    });
    dispatch(resetSuccess());
};

export default SuccesMsg;

