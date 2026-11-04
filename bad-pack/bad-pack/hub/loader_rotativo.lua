-- ============================================================
-- Bad Loader Rotativo — tenta multiplos mirrors + cache buster
-- Esse e o script que voce vende aos clientes:
-- loadstring(game:HttpGet("https://SEU_LOADER_URL"))()
-- ============================================================
local mirrors = {
    -- edite com seus links reais:
    "https://gist.githubusercontent.com/pakau7xis-ctrl/e85182a29959ceafafb65d8958f41154/raw/bad_v9.lua",
    "https://raw.githubusercontent.com/SEU_USER/bad-mirror/main/bad_v9.lua",
    "https://files.catbox.moe/SEU_HASH.lua",
}

local function tryLoad()
    for _, url in ipairs(mirrors) do
        local full = url .. (url:find("%?") and "&" or "?") .. "t=" .. tostring(tick())
        local ok, src = pcall(function() return game:HttpGet(full) end)
        if ok and src and #src > 1000 then
            local f, err = loadstring(src)
            if f then return f() end
            warn("[Bad Loader] erro parse mirror "..url..": "..tostring(err))
        else
            warn("[Bad Loader] mirror indisponivel: "..url)
        end
    end
    warn("[Bad Loader] NENHUM MIRROR ACESSIVEL.")
end

tryLoad()
