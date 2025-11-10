"use client";

import { Loader } from "@/components/ui/loader";
import UserProfile from "./UserProfile";
import { useUserProfile } from "@/lib/react-query/queries/user/users";
import { useEffect, useState } from "react";

interface UserModelProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
}

export default function UserModel({ isOpen, onClose, userId }: UserModelProps) {
    const [user, setUser] = useState(null);

    const profile = useUserProfile();
    useEffect(() => {
        profile.mutate({
            id: userId
        }, {
            onSuccess: (d) => {
                setUser(d.data)
            }, 
            onError: (e) => {
                console.log(e)
            }
        })
    }, [userId]);    

    return (
        <>
            {user ? (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop overlay */}
                        <div
                            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={onClose}
                        ></div>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* 2. Modal Panel (The actual content box) */}
                        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl sm:w-full">
                            <div className="space-y-2">
                                <UserProfile user={user} onClose={onClose} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </>
    );
}
