import net from 'node:net'
import fs from 'node:fs'
import os from 'node:os'

export default {
  createServer: function (listener: (socket: net.Socket) => void): net.Server {
    const server = net.createServer((socket) => {
      listener({
        on(event: string, listener: (...args: any[]) => void) {
          socket.on(event, listener)
        },
        write(buffer: Uint8Array | string, cb?: (err?: Error | null) => void) {
          return socket.write(buffer, cb)
        },
      } as any)
    })

    return {
      listen(port: number) {
        server.listen(port)
      },
      close() {
        server.close()
      },
    } as any
  },
  writeFile: fs.promises.writeFile,
  readFile: fs.promises.readFile,
  existsSync: fs.existsSync,
  isDirectory: async function (file: string): Promise<boolean> {
    const stats = await fs.promises.stat(file)
    return stats.isDirectory()
  },
  tmpdir: () => {
    return os.tmpdir()
  },
}
