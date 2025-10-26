import { UUIDService } from "@src/domain/services/UUIDService"
import { validate as uuidValidate, v4 as uuidv4 } from "uuid"

export class UuidServiceImpl implements UUIDService {
    generate(): string {
        return uuidv4()
    }
    validate(id: string): boolean {
        return uuidValidate(id)
    }
}

// Export alias for backward compatibility with existing imports that expect
// the name `UuidServicesImpl` (plural). Some tests/modules import that name.
export { UuidServiceImpl as UuidServicesImpl }
