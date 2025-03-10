import React, { useEffect, useState } from "react";
import api from "../../api/eventApi.js";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Modal, Button } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editorDescriptionState, setEditorDescriptionState] = useState(
    EditorState.createEmpty()
  );
  const [editorNoticeContentState, setEditorNoticeContentState] = useState(
    EditorState.createEmpty()
  );
  const [selectedEvent, setSelectedEvent] = useState(null); // Lưu event được chọn
  const [dateError, setDateError] = useState(""); // State lưu lỗi ngày
  const [editEvent, setEditEvent] = useState({
    title: "",
    homePageUrl: "",
    startTime: "",
    endTime: "",
    detailUrl: "",
    isMainEvent: false,
  });
  const [newEvent, setNewEvent] = useState({
    title: "",
    homePageUrl: "",
    startTime: "",
    endTime: "",
    detailUrl: "",
    isMainEvent: false,
  });

  const fetchEvents = async () => {
    try {
      const res = await api.getAll();
      setEvents(res.data);
    } catch (error) {
      console.log("Failed to fetch events: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sự kiện này không?")) return;
    try {
      await api.deleteEventById(id);
      fetchEvents();
    } catch (error) {
      console.log("Failed to delete event: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditorDescriptionChange = (state) => {
    setEditorDescriptionState(state);
    setNewEvent((prev) => ({
      ...prev,
      description: draftToHtml(convertToRaw(state.getCurrentContent())), // Chuyển đổi nội dung soạn thảo thành HTML
    }));
  };

  const handleEditorDescriptionUpdateChange = (state) => {
    setEditorDescriptionState(state);
    setEditEvent((prev) => ({
      ...prev,
      description: draftToHtml(convertToRaw(state.getCurrentContent())), // Chuyển đổi nội dung soạn thảo thành HTML
    }));
  };
  // Cập nhật state khi nhập dữ liệu form Edit
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleEditorNoticeContentChange = (state) => {
    setEditorNoticeContentState(state);
    setNewEvent((prev) => ({
      ...prev,
      noticeContent: draftToHtml(convertToRaw(state.getCurrentContent())), // Chuyển đổi nội dung soạn thảo thành HTML
    }));
  };
  const handleEditorNoticeContentUpdateChange = (state) => {
    setEditorNoticeContentState(state);
    setEditEvent((prev) => ({
      ...prev,
      noticeContent: draftToHtml(convertToRaw(state.getCurrentContent())), // Chuyển đổi nội dung soạn thảo thành HTML
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDateError(""); // Reset lỗi trước khi kiểm tra

    const start = new Date(newEvent.startTime);
    const end = new Date(newEvent.endTime);

    // Kiểm tra nếu startTime >= endTime
    if (start >= end) {
      setDateError(
        "Start date must be before the end date and cannot be the same."
      );
      return; // Dừng submit nếu có lỗi
    }

    try {
      await api.addNewEvent(newEvent);
      setShowForm(false);
      setNewEvent({
        title: "",
        homePageUrl: "",
        detailUrl: "",
        startTime: "",
        endTime: "",
        description: "",
        noticeContent: "",
        isMainEvent: false,
      });
      setEditorDescriptionState(EditorState.createEmpty()); // Reset editor
      fetchEvents();
    } catch (error) {
      console.log("Failed to create event: ", error);
    }
  };
  const handleShowModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };
  // Mở modal edit và load dữ liệu vào form
  const handleShowEditModal = (event) => {
    setEditEvent(event);
    setShowEditModal(true);

    // Chuyển đổi HTML sang draft-js EditorState
    const descriptionBlocks = htmlToDraft(event.description || "");
    const descriptionContentState = ContentState.createFromBlockArray(
      descriptionBlocks.contentBlocks
    );
    setEditorDescriptionState(
      EditorState.createWithContent(descriptionContentState)
    );

    const noticeBlocks = htmlToDraft(event.noticeContent || "");
    const noticeContentState = ContentState.createFromBlockArray(
      noticeBlocks.contentBlocks
    );
    setEditorNoticeContentState(
      EditorState.createWithContent(noticeContentState)
    );
  };
  // close modal edit
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditorDescriptionState(EditorState.createEmpty());
    setEditorNoticeContentState(EditorState.createEmpty());
  };

  // Gửi API để cập nhật sự kiện
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateEventById(editEvent._id, editEvent);
      setShowEditModal(false);
      handleCloseEditModal();

      fetchEvents(); // Refresh danh sách sự kiện
    } catch (error) {
      console.log("Failed to update event: ", error);
    }
  };
  useEffect(() => {
    if (!showEditModal) {
      setEditorDescriptionState(EditorState.createEmpty());
      setEditorNoticeContentState(EditorState.createEmpty());
    }
  }, [showEditModal]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // "01/01/2025"
  };
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Events</h1>
          <button
            className="btn btn-outline-dark mb-3"
            style={{ borderRadius: "0px" }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "Add Event"}
          </button>

          {/* Form nhập event */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header">Create New Event</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={newEvent.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="homePageUrl"
                      value={newEvent.homePageUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image Detail URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="detailUrl"
                      value={newEvent.detailUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startTime"
                      value={newEvent.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="endTime"
                      value={newEvent.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* Hiển thị lỗi nếu có */}
                  {dateError && <p className="text-danger">{dateError}</p>}{" "}
                  <div className="mb-3">
                    <label className="form-label">Event Detail</label>
                    <Editor
                      editorState={editorDescriptionState}
                      wrapperClassName="editor-wrapper"
                      editorClassName="editor-content"
                      toolbarClassName="editor-toolbar"
                      onEditorStateChange={handleEditorDescriptionChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notice Content</label>
                    <Editor
                      editorState={editorNoticeContentState}
                      wrapperClassName="editor-wrapper"
                      editorClassName="editor-content"
                      toolbarClassName="editor-toolbar"
                      onEditorStateChange={handleEditorNoticeContentChange}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isMainEvent"
                      checked={newEvent.isMainEvent}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Is Main Event?</label>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Create Event
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Danh sách sự kiện */}
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-table me-1"></i> List of events
            </div>
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Image Main</th>

                    <th>Start Date</th>
                    <th>End Date</th>

                    <th>Main Event</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td>{event.title}</td>
                      <td>
                        <img
                          src={event.homePageUrl}
                          alt={event.title}
                          width="100"
                        />
                      </td>

                      <td>{formatDate(event.startTime)}</td>
                      <td>{formatDate(event.endTime)}</td>

                      <td>{event.isMainEvent ? "True" : "False"}</td>
                      <td className="d-flex flex-column">
                        <button
                          className="btn btn-success text-white mb-2"
                          onClick={() => handleShowModal(event)}
                        >
                          View Detail
                        </button>
                        <button
                          className="btn btn-primary text-white mb-2"
                          onClick={() => handleShowEditModal(event)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="btn btn-danger text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Modal hiển thị chi tiết sự kiện */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedEvent?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedEvent && (
                <div>
                  <p>
                    <strong>Image detail:</strong>{" "}
                    <img
                      src={selectedEvent.detailUrl}
                      alt={selectedEvent.title}
                      width="100"
                    />
                  </p>

                  <p>
                    <strong>Description:</strong>
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedEvent.description,
                    }}
                  />
                  <p>
                    <strong>Notice Content:</strong>
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedEvent.noticeContent,
                    }}
                  />
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          {/* Modal chỉnh sửa sự kiện */}
          <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editEvent && (
                <form onSubmit={handleEditSubmit}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="title"
                    value={editEvent.title}
                    onChange={handleEditChange}
                    required
                  />

                  <Editor
                    editorState={editorDescriptionState}
                    onEditorStateChange={handleEditorDescriptionUpdateChange}
                  />
                  <Editor
                    editorState={editorNoticeContentState}
                    onEditorStateChange={handleEditorNoticeContentUpdateChange}
                  />
                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                </form>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
}
