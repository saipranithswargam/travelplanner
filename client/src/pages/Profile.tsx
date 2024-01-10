import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useForm } from "react-hook-form";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";
import { userActions } from "../features/userSlice";
import CircularProgress from "@mui/material/CircularProgress";

function Profile() {
    const user = useAppSelector((state) => state.user);
    const [editProfile, setEditProfile] = useState(false);
    const [discardChanges, setDiscardChanges] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        reset,
    } = useForm();

    const handleEditProfile = () => {
        setEditProfile(true);
        setDiscardChanges(true);
    };

    const handleDiscardChanges = () => {
        reset({ name: user.name });
        setDiscardChanges(false);
        setEditProfile(false);
    };

    const editPencil = (
        <svg viewBox="0 0 24 24" fill="" width="24" height="18">
            <path
                fill-rule="evenodd"
                d="M18.8525,7.543 L17.7515,8.644 L15.3565,6.248 L16.4575,5.147 C16.5555,5.05 16.6835,5.001 16.8105,5.001 C16.9385,5.001 17.0665,5.05 17.1645,5.147 L18.8525,6.835 C19.0475,7.03 19.0475,7.348 18.8525,7.543 L18.8525,7.543 Z M8.1895,18.206 C8.1185,18.276 8.0275,18.324 7.9295,18.344 L5.1275,18.873 L5.6575,16.07 C5.6755,15.972 5.7225,15.882 5.7945,15.811 L14.6495,6.955 L17.0445,9.351 L8.1895,18.206 Z M19.5595,6.128 L17.8715,4.44 C17.2865,3.856 16.3355,3.856 15.7505,4.44 L5.0875,15.103 C4.8735,15.317 4.7295,15.588 4.6745,15.886 L4.0085,19.407 C3.9775,19.569 4.0295,19.736 4.1465,19.854 C4.2415,19.948 4.3685,20 4.4995,20 C4.5305,20 4.5615,19.997 4.5925,19.991 L8.1165,19.326 C8.4145,19.269 8.6855,19.125 8.8965,18.912 L19.5595,8.25 C20.1445,7.665 20.1445,6.713 19.5595,6.128 L19.5595,6.128 Z"
            ></path>
        </svg>
    );

    const onSubmit = async (data: any) => {
        if (data.newPassword === data.confirmPassword) {
            const formData = {
                ...data,
            };
            setLoading(true);
            try {
                const response = await axiosInstance.put(
                    "/user/editaccount",
                    formData
                );
                setLoading(false);
                setDiscardChanges(false);
                setEditProfile(false);
                dispatch(userActions.setName(data.name));
                toast.success("Profile Updated Successfully!", {
                    position: "top-right",
                });
            } catch (err: any) {
                console.log(err);
                setLoading(false);
                setDiscardChanges(false);
                setEditProfile(false);
                toast.error(err.response.data.message, {
                    position: "top-right",
                });
            }
        }
    };

    useEffect(() => {
        reset({
            name: user.name,
            password: "",
            newPassword: "",
            confirmPassword: "",
        });
    }, []);

    return (
        <div className="user-profile__lower">
            <div className="user-profile__lower--details">
                <div className="user-profile__lower--options">
                    <h1>Profile</h1>
                </div>
                <div className="user-profile__lower--edit-button">
                    {!editProfile && (
                        <button onClick={handleEditProfile}>
                            {editPencil} Edit Profile
                        </button>
                    )}
                    {discardChanges && (
                        <button onClick={handleDiscardChanges}>
                            Discard Changes
                        </button>
                    )}
                </div>
                <form
                    className="user-profile__lower--form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="user-profile__lower--inputGroup">
                        <label>Name</label>
                        <input
                            disabled={!editProfile}
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />
                        {errors.name && (
                            <p className="errorMessage" role="alert">
                                {errors.name?.message?.toString()}
                            </p>
                        )}
                    </div>
                    <div className="user-profile__lower--inputGroup">
                        <label>Email</label>
                        <input
                            disabled={true}
                            title="Cannot Edit Email"
                            value={user.email}
                        />
                    </div>
                    <div className="user-profile__lower--inputGroup">
                        <label>Current Password</label>
                        <input
                            disabled={!editProfile}
                            {...register("password", {
                                required: "Password is required",
                            })}
                            type="password"
                        />
                        {errors.password && (
                            <p className="errorMessage" role="alert">
                                {errors.currentPassword?.message?.toString()}
                            </p>
                        )}
                    </div>
                    <div className="user-profile__lower--inputGroup">
                        <label>New Password</label>
                        <input
                            disabled={!editProfile}
                            {...register("newPassword", {
                                pattern: {
                                    value: /^.{8,}$/,
                                    message:
                                        "Password must be atleast 8 characters long",
                                },
                            })}
                            type="password"
                        />
                        {errors.newPassword && (
                            <p className="errorMessage" role="alert">
                                {errors.newPassword?.message?.toString()}
                            </p>
                        )}
                    </div>
                    <div className="user-profile__lower--inputGroup">
                        <label>Confirm New Password</label>
                        <input
                            disabled={!editProfile}
                            {...register("confirmPassword", {})}
                            type="password"
                        />
                        {watch("newPassword") &&
                        watch("newPassword") !== watch("confirmPassword") ? (
                            <p className="errorMessage" role="alert">
                                Password must match
                            </p>
                        ) : null}
                    </div>
                    <div className="user-profile__lower--button">
                        <button disabled={!editProfile}>
                            {" "}
                            {loading ? (
                                <CircularProgress size={"1.5rem"} />
                            ) : (
                                "Update Info"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
