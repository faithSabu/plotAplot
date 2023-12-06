import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutStart,
  signoutFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DeleteModal from "../components/modals/DeleteModal";
import SignoutModal from "../components/modals/SignoutModal";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsErr, setShowListingsErr] = useState(false);
  const [deleteListingErr, setDeleteListingErr] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(null);
  const [deleteListingInfo, setDeleteListingInfo] = useState(null);
  const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; // to make the filename unique
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadErr(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    handleDeleteModalClose();
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async (e) => {
    try {
      dispatch(signoutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        return;
      }
      dispatch(signoutSuccess(data));
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsErr(data.message);
        return;
      }
      if (data.length < 1) return setShowListingsErr("No Listings Found!");
      setUserListings(data);
      setShowListingsErr(false);
    } catch (error) {
      setShowListingsErr(error.message);
    }
  };

  const handleDeleteUserListing = async (listingId) => {
    handleDeleteModalClose();
    try {
      const res = await fetch(`api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setDeleteListingErr({
          listingId,
          errMessage: data.message,
        });
        return;
      }
      setUserListings((prev) => prev.filter((item) => item._id !== listingId));
    } catch (error) {
      setDeleteListingErr({
        listingId,
        errMessage: error.message,
      });
    }
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleteInfo(null);
  };

  const handleDeleteInfo = () => {
    setDeleteInfo({
      onDelete: handleDeleteUser,
      onClose: handleDeleteModalClose,
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteListingInfo = (listingId) => {
    setDeleteInfo({
      onDelete: () => handleDeleteUserListing(listingId),
      onClose: handleDeleteModalClose,
    });
    setIsDeleteModalOpen(true);
  };

  const handleSignoutModalClose = () => {
    setIsSignoutModalOpen(false);
  };

  return (
    <>
      <div className="p-3 w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7 dark:text-white">
          Profile
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            className="rounded-full h-24 w-25 object-cover cursor-pointer self-center mt-2"
            src={formData.avatar || currentUser.avatar}
            alt="profilePic"
          />
          <p className="text-sm self-center">
            {fileUploadErr ? (
              <span className="text-red-700">
                Image Upload Error (Image must be less than 2 MB)
              </span>
            ) : filePercent > 0 && filePercent < 100 ? (
              <span className="text-green-700">{`Uploading ${filePercent} %`}</span>
            ) : filePercent === 100 ? (
              <span className="text-green-700">
                File Uploaded Successfully !!
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser.username}
            id="username"
            className="border p-3 rounded-lg dark:bg-neutral-700 dark:text-slate-200"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            defaultValue={currentUser.email}
            id="email"
            className="border p-3 rounded-lg dark:bg-neutral-700 dark:text-slate-200"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="border p-3 rounded-lg dark:bg-neutral-700 dark:text-slate-200"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <Link
            className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
            to="/create-listing"
          >
            Create Listing
          </Link>
        </form>
        <div className="flex justify-between mt-5">
          <span
            onClick={handleDeleteInfo}
            className="text-red-700 cursor-pointer dark:text-red-500"
          >
            Delete Account
          </span>
          <span
            onClick={() => setIsSignoutModalOpen(true)}
            className="text-red-700 cursor-pointer dark:text-red-500"
          >
            Sign Out
          </span>
        </div>

        {error && <p className="text-red-700 mt-5">{error}</p>}
        {updateSuccess && (
          <p className="text-green-700 mt-5">User updated successfully!!</p>
        )}
        <button
          onClick={handleShowListings}
          className="text-green-700 w-full dark:text-green-500"
        >
          Show Listings
        </button>
        {showListingsErr && (
          <p className="text-sm text-red-700">{showListingsErr}</p>
        )}

        {userListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center mt-7 text-3xl font-semibold dark:text-white">
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div key={listing._id} className="border rounded-lg p-3 gap-4">
                <div className="flex justify-between items-center gap-2">
                  <Link to={`/listing/${listing._id}`}>
                    <img
                      src={listing.imageURLs[0]}
                      alt="listing image"
                      className="h-16 w-16 object-contain"
                    />
                  </Link>
                  <Link
                    className="text-slate-700 font-semibold hover:underline truncate flex-1 dark:text-slate-300"
                    to={`/listing/${listing._id}`}
                  >
                    <p>{listing.name}</p>
                  </Link>

                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleDeleteListingInfo(listing._id)}
                      className="text-red-700 uppercase dark:text-red-500"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/update-listing/${listing._id}`)}
                      className="text-green-700 uppercase dark:text-green-500"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                {deleteListingErr &&
                  deleteListingErr.listingId === listing._id && (
                    <p className="text-red-700 text-sm text-center">
                      Error Deleting - {deleteListingErr.errMessage}
                    </p>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      {isDeleteModalOpen && <DeleteModal deleteInfo={deleteInfo} />}
      {isSignoutModalOpen && (
        <SignoutModal
          onSignout={handleSignout}
          onClose={handleSignoutModalClose}
        />
      )}
    </>
  );
}
