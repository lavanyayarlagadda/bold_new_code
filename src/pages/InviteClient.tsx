import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle,
  User,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCreateClientMutation } from "../redux/services/clientsApi";
import { toast } from "react-toastify";

export default function InviteClient() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createClient] = useCreateClientMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
    address:"",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSendInvitation = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.email.trim()) return;

  //   setIsLoading(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     console.log("Sending invitation:", formData);
  //     setIsLoading(false);
  //     setInviteSent(true);

  //     // Auto-redirect after 3 seconds
  //     setTimeout(() => {
  //       navigate("/clients");
  //     }, 3000);
  //   }, 1500);
  // };



  const handleSendInvitation = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setIsLoading(true);

    const payload = {
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhoneNumber: formData.phone,
      clientAddress: formData.address,
    };

    const res = await createClient(payload).unwrap();

    toast.success("Client created successfully!");
    console.log("API Response:", res);

    setIsLoading(false);
    setInviteSent(true);

    // setTimeout(() => navigate("/clients"), 2000);
  } catch (error: any) {
    console.error("Error creating client:", error);
    toast.error(error?.data?.message || "Failed to create client");
    setIsLoading(false);
  }
};

  const defaultMessage = `Hi ${formData.name || "[Client Name]"},

You're invited to join our client portal where you can:
• Track the progress of your services
• Upload and access documents securely  
• Communicate directly with your assigned team
• View detailed reports and updates

Click the link below to get started and set up your account.

Best regards,
${user?.name}
${user?.organizationId === "org-1" ? "TaskFlow Team" : "Your Service Team"}`;

  if (inviteSent) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Invitation Sent Successfully!
          </h1>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="text-left space-y-2">
              <p className="text-green-800">
                <strong>Recipient:</strong> {formData.name || "New Client"} (
                {formData.email})
              </p>
              <p className="text-green-800">
                <strong>Sent by:</strong> {user?.name}
              </p>
              <p className="text-green-800">
                <strong>Status:</strong> Invitation email delivered
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            The client will receive an email with instructions to set up their
            account and access the portal.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/clients")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Clients
            </button>
            <button
              onClick={() => {
                setInviteSent(false);
                setFormData({ name: "", email: "", message: "" });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Send Another Invitation
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Redirecting to clients page in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate("/clients")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Invite Client
          </h1>
          <p className="text-gray-600">
            Send a formal invitation to onboard a new client or partner
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <form onSubmit={handleSendInvitation} className="space-y-6">
          {/* Client/Partner Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <User className="h-4 w-4 inline mr-2" />
              Client/Partner Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {/* <p className="text-xs text-gray-500 mt-1">
              Optional: This will personalize the invitation message
            </p> */}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <Mail className="h-4 w-4 inline mr-2" />
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Required: The invitation will be sent to this email address
            </p>
          </div>
<div>
  <label className="block text-sm font-medium mb-2">Phone Number *</label>
  <input
    name="phone"
    value={formData.phone}
    onChange={handleInputChange}
    type="text"
    required
    className="w-full px-3 py-2 border rounded-lg"
    placeholder="+91-9876543210"
  />
</div>

<div>
  <label className="block text-sm font-medium mb-2">Address *</label>
  <input
    name="address"
    value={formData.address}
    onChange={handleInputChange}
    type="text"
    required
    className="w-full px-3 py-2 border rounded-lg"
    placeholder="Hyderabad, Telangana, India"
  />
</div>

          {/* Personalized Message */}
          {/* <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Personalized Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={8}
              value={formData.message || defaultMessage}
              onChange={handleInputChange}
              placeholder="Write a custom invitation message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Customize the invitation message or use the default template
            </p>
          </div> */}

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Invitation Preview
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Client Portal Invitation
                  </p>
                  <p className="text-sm text-gray-500">From: {user?.name}</p>
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {formData.message || defaultMessage}
              </div>
              {/* <div className="mt-4 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  disabled
                >
                  Accept Invitation & Set Up Account
                </button>
              </div> */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/clients")}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </button>

            <button
              type="submit"
              disabled={!formData.email.trim() || isLoading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
