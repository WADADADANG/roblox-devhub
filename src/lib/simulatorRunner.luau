-- Roblox Luau Simulator Runner for Lune
local roblox = require("@lune/roblox")
local task = require("@lune/task")
local serde = require("@lune/serde")

-- Structured log collection
local logs = {}

local function pushLog(logType: string, ...)
    local parts = {}
    for i = 1, select("#", ...) do
        local val = select(i, ...)
        table.insert(parts, tostring(val))
    end
    table.insert(logs, {
        type = logType,
        text = table.concat(parts, " "),
        time = os.date("%H:%M:%S")
    })
end

local rawPrint = print

-- Override global print, warn
local env = getfenv()
env.print = function(...)
    pushLog("info", ...)
end

env.warn = function(...)
    pushLog("warn", ...)
end

-- Inject Roblox types
env.Vector3 = roblox.Vector3
env.Vector2 = roblox.Vector2
env.CFrame = roblox.CFrame
env.Color3 = roblox.Color3
env.BrickColor = roblox.BrickColor
env.UDim = roblox.UDim
env.UDim2 = roblox.UDim2
env.Enum = roblox.Enum
env.Instance = roblox.Instance
env.Ray = roblox.Ray
env.task = task

-- DataModel setup
local workspace = roblox.Instance.new("Folder")
workspace.Name = "Workspace"
env.workspace = workspace

local services = {
    Workspace = workspace,
    Players = roblox.Instance.new("Folder"),
    RunService = roblox.Instance.new("Folder"),
    ReplicatedStorage = roblox.Instance.new("Folder"),
    ServerScriptService = roblox.Instance.new("Folder")
}
services.Players.Name = "Players"
services.RunService.Name = "RunService"
services.ReplicatedStorage.Name = "ReplicatedStorage"
services.ServerScriptService.Name = "ServerScriptService"

local game = {
    GetService = function(self, serviceName: string)
        if services[serviceName] then
            return services[serviceName]
        end
        local newSvc = roblox.Instance.new("Folder")
        newSvc.Name = serviceName
        services[serviceName] = newSvc
        return newSvc
    end
}
env.game = game

-- User code injection marker
-- __USER_CODE_START__
-- __USER_CODE_END__

-- Helper to inspect workspace tree
local function inspectInstance(inst: any)
    local item = {
        name = inst.Name,
        className = inst.ClassName,
        properties = {}
    }
    
    pcall(function()
        if inst.Position then item.properties["Position"] = tostring(inst.Position) end
    end)
    pcall(function()
        if inst.Size then item.properties["Size"] = tostring(inst.Size) end
    end)
    pcall(function()
        if inst.Anchored ~= nil then item.properties["Anchored"] = tostring(inst.Anchored) end
    end)
    pcall(function()
        if inst.Color then item.properties["Color"] = tostring(inst.Color) end
    end)
    pcall(function()
        if inst.Transparency ~= nil then item.properties["Transparency"] = tostring(inst.Transparency) end
    end)
    
    item.children = {}
    for _, child in inst:GetChildren() do
        table.insert(item.children, inspectInstance(child))
    end
    return item
end

local explorerTree = {}
for _, child in workspace:GetChildren() do
    table.insert(explorerTree, inspectInstance(child))
end

local result = {
    success = true,
    logs = logs,
    explorer = explorerTree
}

rawPrint("<<__SIMULATOR_RESULT_JSON__>>")
rawPrint(serde.encode("json", result))
