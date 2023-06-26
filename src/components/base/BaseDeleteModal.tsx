import {Button} from "@mui/material";
import {BaseModal, BaseModalProps} from "@/components/base/BaseModal";

interface BaseDeleteModalProps extends BaseModalProps, BaseDeleteModalFooter {
  categoryTitle?: string
  categoryName?: string
  label?: string
}

interface BaseDeleteModalFooter {
  handleCloseDeleteModal?: () => void
  handleDelete?: () => void
  isDisabled?: boolean
  className?: string
  submitText?: string
}

interface BaseDeleteModalInterface {
  footer: React.FC<BaseDeleteModalFooter>;
}

//BaseDeleteModalProps=> interface of Props
//Props => BaseDeleteModalInterface
//=> BaseDeleteModal has a property footer as interface declare
export const BaseDeleteModal: React.FC<BaseDeleteModalProps> & BaseDeleteModalInterface = ({
                                                                                             isOpen,
                                                                                             handleClose,
                                                                                             categoryTitle,
                                                                                             categoryName,
                                                                                             handleDelete,
                                                                                             label,
                                                                                           }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      header={<img alt="icon" src={''}/>}
      footer={<BaseDeleteModal.footer handleCloseDeleteModal={handleClose} handleDelete={handleDelete}/>}
      className="bg-white rounded-lg p-6 justify-center flex flex-col items-center"
    >
      <div className="flex space-x-1">
        <h4 className="text-center text-gray-600">{label}</h4>
      </div>
    </BaseModal>
  );
};
BaseDeleteModal.footer = function ({
                                     isDisabled = false,
                                     handleCloseDeleteModal, handleDelete, className, submitText
                                   }) {
  return (
    <div className={`justify-end flex w-full px-3 ${className}`}>
      <div className="space-x-4">
        <Button onClick={handleCloseDeleteModal}>キャンセル</Button>
        <Button className="bg-blue-500 text-white px-8 disabled:bg-gray-400" onClick={handleDelete}
                disabled={isDisabled}>
          {submitText || "OK"}
        </Button>
      </div>
    </div>
  );
};
