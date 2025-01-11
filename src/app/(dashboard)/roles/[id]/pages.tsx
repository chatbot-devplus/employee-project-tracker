"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getIDAllRole } from "../../../../api/roles";
import { useParams } from "next/navigation";

type Role = {
    id: string,
    role_name: string,
}

const modelRole = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const id = params?.id;
    const fetchIDRoles = async () => {
        if (!id) {
            console.error("ID không hợp lệ");
            return;
        }

        try {
            setLoading(true);
            const dataRoles = await getIDAllRole(id);
            setRoles(dataRoles as Role[]);
        }catch (error) {
            console.error("Error fetching employees:", error);
          } finally {
            setLoading(false);
          }
    }
     useEffect(() => {
        if (id) {
            fetchIDRoles();
        }
    }, [id]);

    return (
        <div>
            <h1>Hihi</h1>
        </div>
    )

}

export default modelRole();
