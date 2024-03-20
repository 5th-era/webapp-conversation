"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useTranslation } from 'react-i18next'

async function bind_sn(phoneNumber: string, SN: string, setInfoHandler: any) {
    const response = await fetch('/api/bind-sn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, SN })
    });
    // 处理响应
    const data = await response.text();
    const parsedData = JSON.parse(data);
    const { message } = parsedData;
    // if (!response.ok) {
    //     // 显示错误消息
    //     alert(message);

    // }
    // setInfoHandler(message);

    return message;
}

export async function get_user(phoneNumber: string) {
    const response = await fetch('/api/get-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
    });
    // 处理响应
    const data = await response.text();
    const parsedData = JSON.parse(data);
    const { message } = parsedData;
    // if (!response.ok) {
    //     // 显示错误消息
    //     alert(message);

    // }
    // setInfoHandler(message);
    let result = "";
    if (message['result'] === "OK") {
        result = message['info'];
    }
    else {
        result = message['result'];
    }
    // console.log("result from get_user:", result);
    return result;
}

export function check_user_valid(user_info) {
    if (user_info['valid_type'] === 'valid_period') {
        const expeired_at = new Date(user_info['expeired_at']);
        const now_local = new Date();
        const now_utc = new Date(now_local.getTime() + now_local.getTimezoneOffset() * 60000);
        // console.log("time:", expeired_at, now_utc)
        if (now_utc <= expeired_at) return true;
        else return false;
    }
    else if (user_info['valid_type'] === 'valid_times') {
        if (0 < user_info['valid_times']) return true;
        else return false;
    }
    else return false;
}

export function check_user_trying(user_info) {
    return (user_info['sn'] === 'trialed_key') ? true : false;
}

export const BindForm = () => {
    const { data: session, status } = useSession();
    const user_name = session.user?.name;

    const router = useRouter();
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        phoneNumber: user_name,
        SN: "",
    });
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    // const { data: session, status } = useSession();
    // const user_info = session.user?.customData;
    // console.log("user_info::", user_info);
    // session.user.customData = { "test": "hello world." };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setFormValues({ phoneNumber: formValues.phoneNumber, SN: "" });

            const res = await bind_sn(formValues.phoneNumber, formValues.SN, setError);
            // console.log(res);
            const user_info = await get_user(formValues.phoneNumber);
            // console.log("user_info: ", user_info);
            if (res === "OK") {
                alert("绑定成功，请重新登录。")
                router.push(callbackUrl);
                signOut({
                    redirect: true,
                    callbackUrl: "/login"
                });
            } else {
                alert("绑定失败，请重试。")
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setError(error);
        }

        setLoading(false);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const input_style =
        "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";
    const input_style_70 =
        "form-control block w-7/10 px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";
    const input_style_30 =
        "form-control block w-3/10 px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

    return (
        <form onSubmit={onSubmit}>
            <p className="text-center bg-green-600 text-white py-4 mb-6 rounded">请绑定序列号</p>
            {error && (
                <p className="text-center bg-red-400 py-4 mb-6 rounded">{error}</p>
            )}
            <div className="mb-6">
                <input
                    required
                    type="text"
                    name="phoneNumber"
                    value={formValues.phoneNumber}
                    disabled={true}
                    onChange={handleChange}
                    placeholder={t('common.auth.phoneNumber') as string}
                    className={`${input_style}`}
                />
            </div>

            <div className="mb-6">
                <input
                    required
                    type="text"
                    name="SN"
                    value={formValues.SN}
                    onChange={handleChange}
                    placeholder={t('common.auth.SN') as string}
                    className={`${input_style}`}
                />
            </div>
            <button
                type="submit"
                style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
                className="inline-block px-7 py-4 bg-blue-400 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                disabled={loading}
            >
                {loading ? "绑定中..." : "绑定"}
            </button>

            <br></br><br></br>
            <div className="flex flex-col items-center justify-center my-4">
                <img
                    className="pr-2"
                    src="/images/sales.jpg"
                    alt="联系班主任"
                    title="联系班主任"
                    style={{ height: "12rem" }}
                />
                <br></br>
                <p className="text-center font-semibold mx-4 mb-0">扫码联系班主任 获取序列号</p>
            </div>

            {/* <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                <p className="text-center font-semibold mx-4 mb-0">OR</p>
            </div>

            <a
                className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
                style={{ backgroundColor: "#3b5998" }}
                onClick={() => alert("Not implemented yet")}
                role="button"
            >
                <img
                    className="pr-2"
                    src="/images/weixin.png"
                    alt=""
                    style={{ height: "2rem" }}
                />
                用微信直接登录
            </a> */}

        </form >
    );
};

export const BindButton = () => {
    return (
        <div>
            <Link
                href="/bind-sn" // 你的目标路由
                className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
                style={{ backgroundColor: "#000000" }}
                role="button"
            >
                免费试用一天，点击获取正式版本。
            </Link>
        </div>
    );
}