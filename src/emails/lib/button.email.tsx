import {Button, ButtonProps} from "@react-email/components";


export const ButtonEmail = (props : ButtonProps) => {

  return (
    <Button
      className="bg-black rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
      {...props}
    >
      {props.children}
    </Button>
  )
}
