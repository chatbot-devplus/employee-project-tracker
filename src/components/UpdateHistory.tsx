import React, { useState, useEffect, useCallback } from "react";
import { Collapse, Input, Tag, Typography, Space, Spin } from "antd";
import { FilterOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { getProjectHistory } from "../api/project";
const { Title, Text } = Typography;

interface UpdateEvent {
  id: string;
  name: string;
  description: string;
  update_time: Date;
  action_type: string;
}

export default function UpdateHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<UpdateEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectHistory = useCallback(async () => {
    setLoading(true);
    try {
      const dataProjects = await getProjectHistory();
      if (!dataProjects) throw new Error("No data fetched");
      setEvents(dataProjects || []);
    } catch (error) {
      console.error("Error fetching project history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectHistory();
  }, [fetchProjectHistory]);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.action_type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getTagColor = (actionType: string) => {
    switch (actionType) {
      case "Edit":
        return "blue";
      case "Add":
        return "green";
      case "Remove":
        return "red";
      default:
        return "default";
    }
  };
  const collapseItems = filteredEvents.map((event) => ({
    key: event.id,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Space>
          <Tag color={getTagColor(event.action_type)}>{event.action_type}</Tag>
          <Text strong>{event.name}</Text>
        </Space>
        <Space>
          <Text
            type="secondary"
            style={{ display: "flex", alignItems: "center" }}
          >
            <ClockCircleOutlined style={{ marginRight: "5px" }} />
            {format(new Date(event.update_time), "MMM d, yyyy HH:mm")}
          </Text>
        </Space>
      </div>
    ),
    children: (
      <>
        <Text strong>Description:</Text> <Text>{event.description}</Text>
        <br />
        <br />
      </>
    ),
  }));

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Title level={2}>Update History</Title>

      <Input
        placeholder="Search updates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        prefix={<FilterOutlined />}
        style={{ marginBottom: "20px" }}
      />

      {loading ? (
        <Spin
          size="large"
          style={{ display: "block", textAlign: "center", marginTop: "20px" }}
        />
      ) : (
        <Collapse items={collapseItems} />
      )}

      {!loading && filteredEvents.length === 0 && (
        <Text
          style={{ display: "block", textAlign: "center", marginTop: "20px" }}
        >
          No updates found.
        </Text>
      )}
    </div>
  );
}
