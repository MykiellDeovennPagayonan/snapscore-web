import TeacherAccount from "./TeacherAccount"
import TeacherProfile from "./TeacherProfile"

// interface TeacherLayoutProps {

// }

export default function TeacherLayout() {
  return (
    <div className="w-full flex flex-col max-w-5xl mx-auto my-12 p-6">
      <TeacherAccount />
      <div className="w-full flex flex-row">
        <TeacherProfile />
      </div>
    </div>
  )
}