import Link from "next/link";
import NavLink from "@/components/base/NavLink";

interface Props {
  user: any
}

export default function AccountMenu({user}: Props) {
  return (
    <div className="user-profile">
      <div className="user-profile__name-container">
        <div className="user-profile__image-container">
          {user?.photoURL ? (
            <img
              className="user-profile__image-user"
              src={user?.photoURL}
              alt=""
            />
          ) : (
            <svg
              enableBackground="new 0 0 15 15"
              viewBox="0 0 15 15"
              x="0"
              y="0"
              className="user-profile__image-svg"
            >
              <g>
                <circle
                  cx="7.5"
                  cy="4.5"
                  fill="none"
                  r="3.8"
                  strokeMiterlimit="10"
                ></circle>
                <path
                  d="m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6"
                  fill="none"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                ></path>
              </g>
            </svg>
          )}
        </div>
        <div className="user-profile__name">{user?.displayName}</div>

        <Link href="/profile" className="user-profile__name-btn">
          Sửa Hồ Sơ
        </Link>
      </div>
      <div className="user-profile__category">
        {/* <div className="user-profile__my-user">Tài Khoản Của Tôi</div> */}
        <NavLink exact={true} href="/account/profile" className="user-profile__my-info" replace>
          Hồ sơ
        </NavLink>
        <NavLink exact={true} href="/account/payment" className="user-profile__my-bank" replace>
          Thẻ tín dụng/ghi nợ
        </NavLink>
        <NavLink exact={true} href="/account/address" className="user-profile__my-adress" replace>
          Địa chỉ
        </NavLink>
        <NavLink exact={true} href="/account/password" className="user-profile__change-password" replace>
          Đổi mật khẩu
        </NavLink>
        <NavLink exact={true} href="/account/purchase" className="user-profile__order" replace>
          Đơn Mua
        </NavLink>
      </div>
    </div>
  )
}
