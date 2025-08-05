import { useState, useEffect } from "react"
import { FiPlus, FiEye, FiTrash2, FiEdit, FiSettings } from "react-icons/fi"
import toast from "react-hot-toast"
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp 
} from "firebase/firestore"
import Table from "../components/Table"
import Modal from "../components/Modal"
import SearchBar from "../components/SearchBar"
import Pagination from "../components/Pagination"
import { db } from "../../../Firebase"

const PlansCreation = () => {
  // State for data
  const [columns, setColumns] = useState([])
  const [plans, setPlans] = useState([])
  const [filteredPlans, setFilteredPlans] = useState([])
  
  // Loading states
  const [plansLoading, setPlansLoading] = useState(true)
  const [columnsLoading, setColumnsLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  
  // Modal states
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false)
  const [showEditPlanModal, setShowEditPlanModal] = useState(false)
  const [showDeletePlanModal, setShowDeletePlanModal] = useState(false)
  const [showColumnModal, setShowColumnModal] = useState(false)
  const [showCreateColumnModal, setShowCreateColumnModal] = useState(false)
  const [showEditColumnModal, setShowEditColumnModal] = useState(false)
  const [showDeleteColumnModal, setShowDeleteColumnModal] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("plans")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Form data
  const [planFormData, setPlanFormData] = useState({})
  const [columnFormData, setColumnFormData] = useState({
    title: "",
    dataIndex: "",
    type: "text",
    required: false,
  })

  // Firebase collections
  const plansCollection = collection(db, "plans")
  const columnsCollection = collection(db, "planColumns")

  // Fetch columns from Firebase
  const fetchColumns = async () => {
    try {
      setColumnsLoading(true)
      const columnsQuery = query(columnsCollection, orderBy("createdAt", "asc"))
      const snapshot = await getDocs(columnsQuery)
      const columnsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // If no columns exist, create default ones
      if (columnsData.length === 0) {
        await createDefaultColumns()
      } else {
        setColumns(columnsData)
      }
    } catch (error) {
      console.error("Error fetching columns:", error)
      toast.error("Failed to fetch columns")
    } finally {
      setColumnsLoading(false)
    }
  }

  // Create default columns if none exist
  const createDefaultColumns = async () => {
    const defaultColumns = [
      {
        title: "Service Title",
        dataIndex: "title",
        type: "text",
        required: true,
        createdAt: serverTimestamp()
      },
      {
        title: "2 Hours Rate",
        dataIndex: "rate1",
        type: "currency",
        required: true,
        createdAt: serverTimestamp()
      },
      {
        title: "4 Hours Rate",
        dataIndex: "rate2",
        type: "currency",
        required: true,
        createdAt: serverTimestamp()
      },
      {
        title: "Full Night Rate",
        dataIndex: "rate3",
        type: "currency",
        required: true,
        createdAt: serverTimestamp()
      },
      {
        title: "CTA",
        dataIndex: "cta",
        type: "button",
        required: false,
        createdAt: serverTimestamp()
      }
    ]

    try {
      const promises = defaultColumns.map(column => addDoc(columnsCollection, column))
      await Promise.all(promises)
      await fetchColumns() // Refresh columns after creating defaults
      toast.success("Default columns created successfully")
    } catch (error) {
      console.error("Error creating default columns:", error)
      toast.error("Failed to create default columns")
    }
  }

  // Set up real-time listener for plans
  const setupPlansListener = () => {
    try {
      setPlansLoading(true)
      const plansQuery = query(plansCollection, orderBy("createdAt", "desc"))
      
      const unsubscribe = onSnapshot(plansQuery, (snapshot) => {
        const plansData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPlans(plansData)
        setFilteredPlans(plansData)
        setPlansLoading(false)
      }, (error) => {
        console.error("Error in plans listener:", error)
        toast.error("Failed to fetch plans")
        setPlansLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error("Error setting up plans listener:", error)
      toast.error("Failed to setup real-time updates")
      setPlansLoading(false)
    }
  }

  // Set up real-time listener for columns
  const setupColumnsListener = () => {
    try {
      const columnsQuery = query(columnsCollection, orderBy("createdAt", "asc"))
      
      const unsubscribe = onSnapshot(columnsQuery, (snapshot) => {
        const columnsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setColumns(columnsData)
        setColumnsLoading(false)
      }, (error) => {
        console.error("Error in columns listener:", error)
        toast.error("Failed to fetch columns")
        setColumnsLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error("Error setting up columns listener:", error)
      setColumnsLoading(false)
    }
  }

  // Initialize component
  useEffect(() => {
    const plansUnsubscribe = setupPlansListener()
    const columnsUnsubscribe = setupColumnsListener()

    // Cleanup function
    return () => {
      if (plansUnsubscribe) plansUnsubscribe()
      if (columnsUnsubscribe) columnsUnsubscribe()
    }
  }, [])

  // Initialize plan form data when columns change
  useEffect(() => {
    if (columns.length > 0) {
      const formData = {}
      columns.forEach((col) => {
        if (col.type !== "button") {
          formData[col.dataIndex] = ""
        }
      })
      setPlanFormData(formData)
    }
  }, [columns])

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredPlans(plans)
      } else {
        const filtered = plans.filter((plan) =>
          Object.values(plan).some((value) => 
            value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
        setFilteredPlans(filtered)
      }
      setCurrentPage(1)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, plans])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Plan CRUD Operations
  const handleCreatePlan = async (e) => {
    e.preventDefault()
    if (operationLoading) return

    try {
      setOperationLoading(true)
      const planData = {
        ...planFormData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await addDoc(plansCollection, planData)
      setPlanFormData({})
      setShowCreatePlanModal(false)
      toast.success("Plan created successfully")
    } catch (error) {
      console.error("Error creating plan:", error)
      toast.error("Failed to create plan")
    } finally {
      setOperationLoading(false)
    }
  }

  const handleUpdatePlan = async (e) => {
    e.preventDefault()
    if (operationLoading || !selectedPlan) return

    try {
      setOperationLoading(true)
      const planRef = doc(db, "plans", selectedPlan.id)
      const updateData = {
        ...planFormData,
        updatedAt: serverTimestamp()
      }

      await updateDoc(planRef, updateData)
      setPlanFormData({})
      setShowEditPlanModal(false)
      setSelectedPlan(null)
      toast.success("Plan updated successfully")
    } catch (error) {
      console.error("Error updating plan:", error)
      toast.error("Failed to update plan")
    } finally {
      setOperationLoading(false)
    }
  }

  const confirmDeletePlan = async () => {
    if (operationLoading || !selectedPlan) return

    try {
      setOperationLoading(true)
      const planRef = doc(db, "plans", selectedPlan.id)
      await deleteDoc(planRef)
      
      setShowDeletePlanModal(false)
      setSelectedPlan(null)
      toast.success("Plan deleted successfully")
    } catch (error) {
      console.error("Error deleting plan:", error)
      toast.error("Failed to delete plan")
    } finally {
      setOperationLoading(false)
    }
  }

  // Column CRUD Operations
  const handleCreateColumn = async (e) => {
    e.preventDefault()
    if (operationLoading) return

    try {
      setOperationLoading(true)
      const columnData = {
        ...columnFormData,
        createdAt: serverTimestamp()
      }

      await addDoc(columnsCollection, columnData)
      setColumnFormData({
        title: "",
        dataIndex: "",
        type: "text",
        required: false,
      })
      setShowCreateColumnModal(false)
      toast.success("Column created successfully")
    } catch (error) {
      console.error("Error creating column:", error)
      toast.error("Failed to create column")
    } finally {
      setOperationLoading(false)
    }
  }

  const handleUpdateColumn = async (e) => {
    e.preventDefault()
    if (operationLoading || !selectedColumn) return

    try {
      setOperationLoading(true)
      const columnRef = doc(db, "planColumns", selectedColumn.id)
      const updateData = {
        ...columnFormData,
        updatedAt: serverTimestamp()
      }

      await updateDoc(columnRef, updateData)
      setColumnFormData({
        title: "",
        dataIndex: "",
        type: "text",
        required: false,
      })
      setShowEditColumnModal(false)
      setSelectedColumn(null)
      toast.success("Column updated successfully")
    } catch (error) {
      console.error("Error updating column:", error)
      toast.error("Failed to update column")
    } finally {
      setOperationLoading(false)
    }
  }

  const confirmDeleteColumn = async () => {
    if (operationLoading || !selectedColumn) return

    if (selectedColumn.required) {
      toast.error("Cannot delete required column")
      return
    }

    try {
      setOperationLoading(true)
      const columnRef = doc(db, "planColumns", selectedColumn.id)
      await deleteDoc(columnRef)
      
      setShowDeleteColumnModal(false)
      setSelectedColumn(null)
      toast.success("Column deleted successfully")
    } catch (error) {
      console.error("Error deleting column:", error)
      toast.error("Failed to delete column")
    } finally {
      setOperationLoading(false)
    }
  }

  // Helper functions
  const initializePlanFormData = () => {
    const formData = {}
    columns.forEach((col) => {
      if (col.type !== "button") {
        formData[col.dataIndex] = ""
      }
    })
    setPlanFormData(formData)
  }

  const handleViewPlanDetails = (plan) => {
    setSelectedPlan(plan)
    setShowPlanModal(true)
  }

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan)
    setPlanFormData(plan)
    setShowEditPlanModal(true)
  }

  const handleDeletePlan = (plan) => {
    setSelectedPlan(plan)
    setShowDeletePlanModal(true)
  }

  const handleEditColumn = (column) => {
    setSelectedColumn(column)
    setColumnFormData(column)
    setShowEditColumnModal(true)
  }

  const handleDeleteColumn = (column) => {
    setSelectedColumn(column)
    setShowDeleteColumnModal(true)
  }

  // Generate table columns for display
  const generateTableColumns = () => {
    const tableColumns = columns.map((col) => {
      if (col.type === "button") {
        return {
          key: col.dataIndex,
          label: col.title,
          render: (plan) => (
            <button
              onClick={() => {
                toast.success("Booking action triggered")
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
            >
              Book Now
            </button>
          ),
        }
      }
      return {
        key: col.dataIndex,
        label: col.title,
      }
    })

    // Add actions column
    tableColumns.push({
      key: "actions",
      label: "Actions",
      render: (plan) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleViewPlanDetails(plan)} 
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            disabled={operationLoading}
          >
            <FiEye size={16} />
          </button>
          <button 
            onClick={() => handleEditPlan(plan)} 
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            disabled={operationLoading}
          >
            <FiEdit size={16} />
          </button>
          <button 
            onClick={() => handleDeletePlan(plan)} 
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            disabled={operationLoading}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    })

    return tableColumns
  }

  // Generate column management table
  const columnTableColumns = [
    { key: "title", label: "Column Title" },
    { key: "dataIndex", label: "Data Index" },
    { key: "type", label: "Type" },
    {
      key: "required",
      label: "Required",
      render: (column) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            column.required ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {column.required ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (column) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleEditColumn(column)} 
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            disabled={operationLoading}
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => handleDeleteColumn(column)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            disabled={column.required || operationLoading}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredPlans.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage)

  const renderFormField = (column) => {
    const value = planFormData[column.dataIndex] || ""
    const onChange = (e) => setPlanFormData((prev) => ({ ...prev, [column.dataIndex]: e.target.value }))

    switch (column.type) {
      case "currency":
        return (
          <input
            type="text"
            required={column.required}
            value={value}
            onChange={onChange}
            placeholder="₹ 0000"
            disabled={operationLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        )
      case "text":
      default:
        return (
          <input
            type="text"
            required={column.required}
            value={value}
            onChange={onChange}
            disabled={operationLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plans Creation</h1>
          <p className="text-gray-600">Manage your service plans and pricing structure</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              initializePlanFormData()
              setShowCreatePlanModal(true)
            }}
            disabled={columnsLoading || operationLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400"
          >
            <FiPlus size={20} />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("plans")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "plans"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Plans ({plans.length})
          </button>
          <button
            onClick={() => setActiveTab("columns")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "columns"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Columns ({columns.length})
          </button>
        </nav>
      </div>

      {activeTab === "plans" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <SearchBar onSearch={handleSearch} placeholder="Search plans..." />
          </div>

          <Table 
            columns={generateTableColumns()} 
            data={currentItems} 
            emptyMessage="No plans found"
            loading={plansLoading}
          />

          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "columns" && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Column Structure</h3>
            <button
              onClick={() => setShowCreateColumnModal(true)}
              disabled={operationLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
            >
              <FiPlus size={16} />
              <span>Add Column</span>
            </button>
          </div>

          <Table 
            columns={columnTableColumns} 
            data={columns} 
            emptyMessage="No columns found"
            loading={columnsLoading}
          />
        </div>
      )}

      {/* Plan Details Modal */}
      <Modal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} title="Plan Details" size="lg">
        {selectedPlan && (
          <div className="space-y-4">
            {columns
              .filter((col) => col.type !== "button")
              .map((column) => (
                <div key={column.dataIndex}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{column.title}</label>
                  <p className="text-gray-900">{selectedPlan[column.dataIndex] || "-"}</p>
                </div>
              ))}
          </div>
        )}
      </Modal>

      {/* Create/Edit Plan Modal */}
      <Modal
        isOpen={showCreatePlanModal || showEditPlanModal}
        onClose={() => {
          setShowCreatePlanModal(false)
          setShowEditPlanModal(false)
          setPlanFormData({})
          setSelectedPlan(null)
        }}
        title={showEditPlanModal ? "Edit Plan" : "Create New Plan"}
        size="lg"
      >
        <form onSubmit={showEditPlanModal ? handleUpdatePlan : handleCreatePlan} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {columns
              .filter((col) => col.type !== "button")
              .map((column) => (
                <div key={column.dataIndex}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column.title} {column.required && <span className="text-red-500">*</span>}
                  </label>
                  {renderFormField(column)}
                </div>
              ))}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreatePlanModal(false)
                setShowEditPlanModal(false)
                setPlanFormData({})
                setSelectedPlan(null)
              }}
              disabled={operationLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={operationLoading}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400"
            >
              {operationLoading 
                ? (showEditPlanModal ? "Updating..." : "Creating...") 
                : (showEditPlanModal ? "Update Plan" : "Create Plan")
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Plan Confirmation Modal */}
      <Modal
        isOpen={showDeletePlanModal}
        onClose={() => setShowDeletePlanModal(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to delete this plan? This action cannot be undone.</p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeletePlanModal(false)}
              disabled={operationLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeletePlan}
              disabled={operationLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-400"
            >
              {operationLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Column Management Modal */}
      <Modal isOpen={showColumnModal} onClose={() => setShowColumnModal(false)} title="Column Management" size="xl">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Current Columns</h3>
            <button
              onClick={() => setShowCreateColumnModal(true)}
              disabled={operationLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
            >
              <FiPlus size={16} />
              <span>Add Column</span>
            </button>
          </div>
          <Table 
            columns={columnTableColumns} 
            data={columns} 
            emptyMessage="No columns found"
            loading={columnsLoading}
          />
        </div>
      </Modal>

      {/* Create/Edit Column Modal */}
      <Modal
        isOpen={showCreateColumnModal || showEditColumnModal}
        onClose={() => {
          setShowCreateColumnModal(false)
          setShowEditColumnModal(false)
          setColumnFormData({
            title: "",
            dataIndex: "",
            type: "text",
            required: false,
          })
          setSelectedColumn(null)
        }}
        title={showEditColumnModal ? "Edit Column" : "Create New Column"}
        size="md"
      >
        <form onSubmit={showEditColumnModal ? handleUpdateColumn : handleCreateColumn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Column Title</label>
            <input
              type="text"
              required
              value={columnFormData.title}
              onChange={(e) => setColumnFormData((prev) => ({ ...prev, title: e.target.value }))}
              disabled={operationLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="e.g., 2 Hours Rate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Index</label>
            <input
              type="text"
              required
              value={columnFormData.dataIndex}
              onChange={(e) => setColumnFormData((prev) => ({ ...prev, dataIndex: e.target.value }))}
              disabled={operationLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="e.g., rate2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Column Type</label>
            <select
              value={columnFormData.type}
              onChange={(e) => setColumnFormData((prev) => ({ ...prev, type: e.target.value }))}
              disabled={operationLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="text">Text</option>
              <option value="currency">Currency</option>
              <option value="button">Button (CTA)</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={columnFormData.required}
              onChange={(e) => setColumnFormData((prev) => ({ ...prev, required: e.target.checked }))}
              disabled={operationLoading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
            />
            <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
              Required field
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateColumnModal(false)
                setShowEditColumnModal(false)
                setColumnFormData({
                  title: "",
                  dataIndex: "",
                  type: "text",
                  required: false,
                })
                setSelectedColumn(null)
              }}
              disabled={operationLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={operationLoading}
              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400"
            >
              {operationLoading 
                ? (showEditColumnModal ? "Updating..." : "Creating...") 
                : (showEditColumnModal ? "Update Column" : "Create Column")
              }
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Column Confirmation Modal */}
      <Modal
        isOpen={showDeleteColumnModal}
        onClose={() => setShowDeleteColumnModal(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the "{selectedColumn?.title}" column? This action cannot be undone and will
            affect all existing plans.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteColumnModal(false)}
              disabled={operationLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 disabled:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteColumn}
              disabled={operationLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-400"
            >
              {operationLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PlansCreation