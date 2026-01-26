import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X, Mail, ChevronDown, Undo2, Redo2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // ✅ hot-toast
import {
  fetchEmailPlaceholders,
  updateEmailTemplateService,
} from "../service/mainServices";
import useEmailTemplateStore from "../store/emailtemplateStore";

const UpdateEmailTemplateModal = ({ isOpen, onClose, templateData }) => {
  const quillRef = useRef(null);
  const { loadTemplates } = useEmailTemplateStore();

  if (!isOpen || !templateData) return null;

  // -------------------- State --------------------
  const [templateTitle, setTemplateTitle] = useState(templateData.name || "");
  const [subject, setSubject] = useState(templateData.subject || "");
  const [content, setContent] = useState(templateData.body_html || "");
  const [isFirstEdit, setIsFirstEdit] = useState(true);
  const [placeholders, setPlaceholders] = useState([]);
  const [showPlaceholderMenu, setShowPlaceholderMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  // -------------------- Load Placeholders --------------------
  useEffect(() => {
    if (!isOpen) return;

    const loadPlaceholders = async () => {
      try {
        const data = await fetchEmailPlaceholders();
        setPlaceholders(data || []);
      } catch (error) {
        console.error("Error fetching placeholders:", error);
        toast.error("Failed to load placeholders");
      }
    };
    loadPlaceholders();
  }, [isOpen]);

  // -------------------- Editor logic --------------------
  const handleChange = (value, delta, source) => {
    if (isFirstEdit && source === "user") {
      setContent("");
      setIsFirstEdit(false);
    } else {
      setContent(value);
    }
  };

  const handleUndo = () => quillRef.current?.getEditor().history.undo();
  const handleRedo = () => quillRef.current?.getEditor().history.redo();

  const insertPlaceholder = (placeholder) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;
    const range = editor.getSelection(true);
    const token = `%${placeholder}%`;
    editor.insertText(range?.index || 0, token, "user");
    editor.setSelection((range?.index || 0) + token.length);
    setShowPlaceholderMenu(false);
  };

  const convertPlaceholders = (html) => {
    let converted = html;
    placeholders.forEach((ph) => {
      const regex = new RegExp(`%${ph.placeholder}%`, "g");
      converted = converted.replace(regex, `{{.${ph.placeholder}}}`);
    });
    return converted;
  };

  // -------------------- Handle Update --------------------
  const handleUpdate = async () => {
    if (!templateTitle || !subject) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const body_html = convertPlaceholders(content);

      const response = await updateEmailTemplateService({
        purpose: templateData.purpose,
        name: templateTitle,
        subject,
        body_html,
      });

      if (response) {
        toast.success("Email template updated successfully!");
        await loadTemplates();
        onClose();
      } else {
        toast.error("Failed to update template");
      }
    } catch (error) {
      console.error("Error updating email template:", error);
      toast.error(error?.message || "Something went wrong while updating template");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
    history: { delay: 400, maxStack: 200, userOnly: true },
  };

  const inputClass =
    "w-full px-5 py-3 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all";

  return ReactDOM.createPortal(
    <>
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Hot toast container */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .ql-toolbar.ql-snow {
                border: 1px solid #e5e7eb !important;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                background: #fff;
              }
              .ql-container.ql-snow {
                border: 1px solid #e5e7eb !important;
                border-top: none !important;
                border-bottom-left-radius: 12px;
                border-bottom-right-radius: 12px;
                min-height: 400px;
                font-size: 14px;
              }
            `,
          }}
        />

        <div className="bg-[#F9FAFB] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Mail className="text-gray-700" size={20} />
              <h2 className="text-[16px] font-semibold text-gray-800">
                Update Email Template
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto flex flex-col gap-5">
            <input
              type="text"
              placeholder="Template Title"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              className={inputClass}
            />

            <div className="flex gap-3">
              <input
                type="text"
                value={templateData.purpose}
                readOnly
                className={`${inputClass} w-[35%] bg-gray-100 cursor-not-allowed`}
              />
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`${inputClass} w-[65%]`}
              />
            </div>

            {/* Editor */}
            <div className="relative bg-white rounded-xl">
              <div className="absolute right-4 top-[10px] z-10 flex items-center gap-2 bg-white px-2">
                <Undo2
                  size={14}
                  onClick={handleUndo}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                />
                <Redo2
                  size={14}
                  onClick={handleRedo}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                />

                {/* Placeholder Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowPlaceholderMenu((p) => !p)}
                    className="flex items-center gap-1 text-[12px] font-medium text-gray-500 hover:text-gray-700"
                  >
                    Placeholder <ChevronDown size={14} />
                  </button>

                  {showPlaceholderMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">
                      {placeholders.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => insertPlaceholder(item.placeholder)}
                          className="w-full text-left px-4 py-2 text-[13px] hover:bg-gray-100"
                        >
                          %{item.placeholder}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={handleChange}
                modules={modules}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 bg-white border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-10 py-2.5 border border-gray-300 rounded-xl text-[14px] font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-12 py-2.5 bg-black text-white rounded-xl text-[14px] font-medium hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default UpdateEmailTemplateModal;
